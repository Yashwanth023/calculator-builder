
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
  { type: 'operator', value: '+' },
];

interface Props {
  onAdd: (component: Omit<CalculatorComponent, 'id'>) => void;
}

export const ComponentLibrary = ({ onAdd }: Props) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-calculator-border animate-slide-in">
      <h2 className="text-lg font-semibold mb-4">Component Library</h2>
      <div className="grid grid-cols-4 gap-2">
        {components.map((component) => (
          <Button
            key={component.value}
            onClick={() => onAdd(component)}
            className={
              component.type === 'display'
                ? 'col-span-4 h-20 bg-white/95 hover:bg-white/90'
                : ''
            }
            variant="outline"
          >
            {component.value || 'Display'}
          </Button>
        ))}
      </div>
    </Card>
  );
};
