
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
  { type: 'operator', value: '+' },
];

interface Props {
  onAdd: (component: Omit<CalculatorComponent, 'id'>) => void;
}

export const ComponentLibrary = ({ onAdd }: Props) => {
  const getButtonClass = (component: Omit<CalculatorComponent, 'id'>) => {
    const baseClass = 'transition-all duration-200 hover:scale-105';
    
    if (component.type === 'display') {
      return `${baseClass} col-span-4 h-20 bg-gradient-to-r from-violet-50 to-white hover:from-violet-100 hover:to-white`;
    }
    if (component.type === 'operator') {
      return `${baseClass} bg-violet-100 text-violet-700 hover:bg-violet-200`;
    }
    if (component.type === 'equals') {
      return `${baseClass} bg-violet-600 text-white hover:bg-violet-700`;
    }
    return `${baseClass} bg-white text-violet-900 hover:bg-violet-50`;
  };

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-md border-violet-200 shadow-lg animate-slide-in">
      <h2 className="text-lg font-semibold mb-4 text-violet-800">Component Library</h2>
      <div className="grid grid-cols-4 gap-2">
        {components.map((component) => (
          <Button
            key={component.value}
            onClick={() => onAdd(component)}
            className={getButtonClass(component)}
            variant="outline"
          >
            {component.value || 'Display'}
          </Button>
        ))}
      </div>
    </Card>
  );
};
