
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
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
  const [isDragging, setIsDragging] = useState(false);
  
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
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);

    if (over && active.id !== over.id) {
      const oldIndex = components.findIndex((c) => c.id === active.id);
      const newIndex = components.findIndex((c) => c.id === over.id);
      reorderComponents(arrayMove(components, oldIndex, newIndex));
      toast.success('Component reordered successfully');
    }
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

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 animate-fade-in text-violet-800">
          Calculator Builder
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ComponentLibrary onAdd={handleAdd} />
          
          <Card className="p-6 bg-white/90 backdrop-blur-md border-violet-200 shadow-lg animate-slide-in">
            <h2 className="text-lg font-semibold mb-4 text-violet-800">Calculator Preview</h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              onDragStart={() => setIsDragging(true)}
            >
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
            </DndContext>
          </Card>
        </div>
      </div>
    </div>
  );
};
