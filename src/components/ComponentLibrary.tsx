
import { useDraggable } from '@dnd-kit/core';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CalculatorComponent } from "@/store/useCalculatorStore";

const components: Omit<CalculatorComponent, 'id'>[] = [
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
  { type: 'clear', value: 'C' },
  { type: 'operator', value: '+' },
];

interface Props {
  onAdd: (component: Omit<CalculatorComponent, 'id'>) => void;
}

const DraggableButton = ({ component, className }: { 
  component: Omit<CalculatorComponent, 'id'>;
  className: string;
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `library-${component.type}-${component.value}`,
    data: component,
  });

  return (
    <Button
      ref={setNodeRef}
      className={className}
      variant="outline"
      {...attributes}
      {...listeners}
    >
      {component.value || 'Display'}
    </Button>
  );
};

export const ComponentLibrary = ({ onAdd }: Props) => {
  const getButtonClass = (component: Omit<CalculatorComponent, 'id'>) => {
    const baseClass = 'transition-all duration-200 hover:scale-105 cursor-move';

    if (component.type === 'clear') {
  return `${baseClass} bg-red-500 text-white hover:bg-red-600 dark:bg-red-700`;
}   
    if (component.type === 'display') {
      return `${baseClass} col-span-4 h-20 bg-gradient-to-r from-violet-50 to-white hover:from-violet-100 hover:to-white dark:from-violet-900 dark:to-violet-800 dark:text-white`;
    }
    if (component.type === 'operator') {
      return `${baseClass} bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-800 dark:text-violet-100`;
    }
    if (component.type === 'equals') {
      return `${baseClass} bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500`;
    }
    return `${baseClass} bg-white text-violet-900 hover:bg-violet-50 dark:bg-violet-900 dark:text-violet-100`;
  };

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-md border-violet-200 shadow-lg animate-slide-in dark:bg-gray-900/90 dark:border-violet-800">
      <h2 className="text-lg font-semibold mb-4 text-violet-800 dark:text-violet-200">Component Library</h2>
      <div className="grid grid-cols-4 gap-2">
        {components.map((component) => (
          <DraggableButton
            key={`${component.type}-${component.value}`}
            component={component}
            className={getButtonClass(component)}
          />
        ))}
      </div>
    </Card>
  );
};
