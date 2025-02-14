
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
          let currentExp = state.expression;
          
          // If there's a result and we're starting a new calculation
          if (state.result !== '0' && !currentExp) {
            if ('+-*/'.includes(value)) {
              currentExp = state.result; // Continue calculation with previous result
            } else {
              state.result = '0'; // Reset result for new calculation
            }
          }
          
          const lastChar = currentExp[currentExp.length - 1];
          
          // Handle operator input
          if ('+-*/'.includes(value)) {
            if ('+-*/'.includes(lastChar)) {
              return {
                expression: currentExp.slice(0, -1) + value,
              };
            }
          }

          // Handle decimal point
          if (value === '.') {
            const parts = currentExp.split(/[\+\-\*\/]/);
            const currentNumber = parts[parts.length - 1];
            if (currentNumber.includes('.')) {
              return { expression: currentExp }; // Prevent multiple decimal points
            }
          }
          
          return {
            expression: currentExp + value,
          };
        }),
        
      calculateResult: () =>
        set((state) => {
          try {
            if (!state.expression) {
              return state;
            }
            
            // Replace all occurrences of multiple operators with the last one
            let sanitizedExpression = state.expression.replace(/[\+\-\*\/]+$/, '');
            
            // Handle edge cases
            if (!sanitizedExpression) {
              return {
                result: '0',
                expression: '',
              };
            }

            // eslint-disable-next-line no-eval
            const calculatedResult = eval(sanitizedExpression);
            
            // Format the result
            const result = Number.isInteger(calculatedResult) 
              ? calculatedResult.toString()
              : Number(calculatedResult.toFixed(8)).toString();

            return {
              result,
              expression: '',
            };
          } catch (error) {
            console.error('Calculation error:', error);
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
