
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CalculatorComponent = {
  id: string;
  type: 'number' | 'operator' | 'display' | 'equals';
  value: string;
};

interface CalculatorState {
  components: CalculatorComponent[];
  expression: string;
  result: string;
  addComponent: (component: CalculatorComponent) => void;
  removeComponent: (id: string) => void;
  reorderComponents: (components: CalculatorComponent[]) => void;
  updateExpression: (value: string) => void;
  calculateResult: () => void;
  clearCalculator: () => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      components: [],
      expression: '',
      result: '0',
      
      addComponent: (component) =>
        set((state) => ({
          components: [...state.components, component],
        })),
        
      removeComponent: (id) =>
        set((state) => ({
          components: state.components.filter((c) => c.id !== id),
        })),
        
      reorderComponents: (components) =>
        set(() => ({
          components,
        })),
        
      updateExpression: (value) =>
        set((state) => {
          const currentExp = state.expression;
          const lastChar = currentExp[currentExp.length - 1];
          
          // Handle operator input
          if ('+-*/'.includes(value)) {
            if ('+-*/'.includes(lastChar)) {
              return {
                expression: currentExp.slice(0, -1) + value,
              };
            }
          }
          
          return {
            expression: currentExp + value,
          };
        }),
        
      calculateResult: () =>
        set((state) => {
          try {
            // eslint-disable-next-line no-eval
            const result = eval(state.expression).toString();
            return {
              result,
              expression: '',
            };
          } catch (error) {
            return {
              result: 'Error',
              expression: '',
            };
          }
        }),
        
      clearCalculator: () =>
        set(() => ({
          expression: '',
          result: '0',
        })),
    }),
    {
      name: 'calculator-storage',
    }
  )
);
