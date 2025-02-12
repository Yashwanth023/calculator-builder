
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    transition,
  } : undefined;

  const getContainerClass = () => {
    return `relative group cursor-move animate-fade-in ${isDragging ? 'opacity-50' : ''}`;
  };

  const getButtonClass = () => {
    const baseClass = 'w-16 h-16 rounded-xl bg-white/95 backdrop-blur-sm border shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg font-medium';
    
    if (component.type === 'display') {
      return `${baseClass} w-full h-20 bg-gradient-to-r from-violet-50 to-white cursor-move dark:from-violet-900 dark:to-violet-800 dark:text-white`;
    }
    if (component.type === 'operator') {
      return `${baseClass} bg-violet-100 border-violet-200 text-violet-700 hover:bg-violet-200 dark:bg-violet-800 dark:border-violet-700 dark:text-violet-100`;
    }
    if (component.type === 'equals') {
      return `${baseClass} bg-violet-600 border-violet-700 text-white hover:bg-violet-700 dark:bg-violet-500`;
    }
    return `${baseClass} bg-white border-violet-100 text-violet-900 hover:bg-violet-50 dark:bg-violet-900 dark:border-violet-800 dark:text-violet-100`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={getContainerClass()}
      {...attributes}
      {...listeners}
    >
      <button
        onClick={() => onClick(component.value)}
        className={getButtonClass()}
      >
        {component.type === 'display' ? (
          <div className="text-right px-4 w-full">
            <div className="text-sm text-violet-400 dark:text-violet-300">{component.value}</div>
            <div className="text-2xl text-violet-900 dark:text-violet-100">{component.value || '0'}</div>
          </div>
        ) : (
          component.value
        )}
      </button>
      
      <button
        onClick={() => onRemove(component.id)}
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity
                 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center
                 text-xs hover:bg-red-600 hover:scale-110 transform duration-200"
      >
        ×
      </button>
    </div>
  );
};
