
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { ComponentLibrary } from './ComponentLibrary';
import { DraggableComponent } from './DraggableComponent';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { Card } from '@/components/ui/card';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

export const CalculatorBuilder = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<any>(null);
  
  const {
    components,
    expression,
    result,
    addComponent,
    removeComponent,
    reorderComponents,
    updateExpression,
    calculateResult,
    clearCalculator,
  } = useCalculatorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setIsDragging(true);
    
    // Check if the dragged item is from the library
    if (typeof active.id === 'string' && active.id.startsWith('library-')) {
      const componentType = active.id.replace('library-', '');
      const component = libraryComponents.find(c => `library-${c.type}-${c.value}` === active.id);
      if (component) {
        setDraggedComponent(component);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setIsDragging(false);

    if (over) {
      if (active.id.toString().startsWith('library-')) {
        // Handle dropping a new component from the library
        if (draggedComponent) {
          const newComponent = { ...draggedComponent, id: nanoid() };
          addComponent(newComponent);
          toast.success('Component added successfully');
        }
      } else if (active.id !== over.id) {
        // Handle reordering existing components
        const oldIndex = components.findIndex((c) => c.id === active.id);
        const newIndex = components.findIndex((c) => c.id === over.id);
        reorderComponents(arrayMove(components, oldIndex, newIndex));
        toast.success('Component reordered successfully');
      }
    }
    setDraggedComponent(null);
  };

  const handleAdd = (component: Omit<typeof components[0], 'id'>) => {
    addComponent({ ...component, id: nanoid() });
    toast.success('Component added successfully');
  };

  const handleRemove = (id: string) => {
    removeComponent(id);
    toast.success('Component removed successfully');
  };

  const handleClick = (value: string) => {
    if (value === '=') {
      calculateResult();
    } else if (value === 'C') {
      clearCalculator();
    } else {
      updateExpression(value);
    }
  };

  const activeComponent = activeId ? (
    draggedComponent || components.find(c => c.id === activeId)
  ) : null;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 dark:from-violet-950 dark:via-purple-900 dark:to-indigo-950">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 animate-fade-in text-violet-800 dark:text-violet-200">
          Calculator Builder
        </h1>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ComponentLibrary onAdd={handleAdd} />
            
            <Card className="p-6 bg-white/90 backdrop-blur-md border-violet-200 shadow-lg animate-slide-in dark:bg-gray-900/90 dark:border-violet-800">
              <h2 className="text-lg font-semibold mb-4 text-violet-800 dark:text-violet-200">Calculator Preview</h2>
              <SortableContext items={components} strategy={rectSortingStrategy}>
                <div className={`grid grid-cols-4 gap-2 ${isDragging ? 'opacity-50' : ''}`}>
                  {components.map((component) => (
                    <div
                      key={component.id}
                      className={component.type === 'display' ? 'col-span-4' : ''}
                    >
                      <DraggableComponent
                        component={{
                          ...component,
                          value: component.type === 'display' ? expression || result : component.value,
                        }}
                        onRemove={handleRemove}
                        onClick={handleClick}
                      />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </Card>
          </div>

          <DragOverlay>
            {activeComponent && (
              <div className={activeComponent.type === 'display' ? 'col-span-4' : ''}>
                <DraggableComponent
                  component={{
                    ...activeComponent,
                    id: activeComponent.id || 'new',
                  }}
                  onRemove={handleRemove}
                  onClick={handleClick}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

const libraryComponents = [
  { type: 'display', value: '' },
  { type: 'number', value: '7' },
  { type: 'number', value: '8' },
  { type: 'number', value: '9' },
  { type: 'operator', value: '/' },
  { type: 'number', value: '4' },
  { type: 'number', value: '5' },
  { type: 'number', value: '6' },
  { type: 'operator', value: '*' },
  { type: 'number', value: '1' },
  { type: 'number', value: '2' },
  { type: 'number', value: '3' },
  { type: 'operator', value: '-' },
  { type: 'number', value: '0' },
  { type: 'operator', value: '.' },
  { type: 'equals', value: '=' },
  { type: 'operator', value: '+' },
];
