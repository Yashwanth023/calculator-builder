
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import type { CalculatorComponent } from '@/store/useCalculatorStore';

interface Props {
  component: CalculatorComponent;
  onRemove: (id: string) => void;
  onClick: (value: string) => void;
}

export const DraggableComponent = ({ component, onRemove, onClick }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group cursor-move animate-fade-in',
        isDragging && 'opacity-50'
      )}
      {...attributes}
      {...listeners}
    >
      <button
        onClick={() => onClick(component.value)}
        className={cn(
          'w-16 h-16 rounded-lg bg-white/90 backdrop-blur-sm border border-calculator-border shadow-sm',
          'hover:bg-calculator-primary transition-colors duration-200',
          'flex items-center justify-center text-lg font-medium text-calculator-accent',
          component.type === 'operator' && 'bg-calculator-primary',
          component.type === 'equals' && 'bg-calculator-accent text-white hover:bg-calculator-accent/90',
          component.type === 'display' && 'w-full h-20 bg-white/95 cursor-move'
        )}
      >
        {component.type === 'display' ? (
          <div className="text-right px-4 w-full">
            <div className="text-sm text-gray-500">{component.value}</div>
            <div className="text-2xl">{component.value || '0'}</div>
          </div>
        ) : (
          component.value
        )}
      </button>
      
      <button
        onClick={() => onRemove(component.id)}
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity
                 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center
                 text-xs hover:bg-red-600"
      >
        ×
      </button>
    </div>
  );
};
