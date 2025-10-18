import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay("0.");
      setNewNumber(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(display);
    } else if (operation) {
      const result = calculate(parseFloat(previousValue), current, operation);
      setDisplay(String(result));
      setPreviousValue(String(result));
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case "+":
        return prev + current;
      case "-":
        return prev - current;
      case "×":
        return prev * current;
      case "÷":
        return prev / current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const result = calculate(parseFloat(previousValue), parseFloat(display), operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handlePercentage = () => {
    const current = parseFloat(display);
    setDisplay(String(current / 100));
  };

  const handleToggleSign = () => {
    const current = parseFloat(display);
    setDisplay(String(current * -1));
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="calculator-container p-6 w-full max-w-sm bg-card border-border shadow-[var(--shadow-glow)]">
        {/* Display */}
        <div className="mb-6 p-6 rounded-2xl bg-[hsl(var(--calculator-display))] min-h-[100px] flex items-end justify-end">
          <div className="text-right">
            {operation && previousValue && (
              <div className="text-muted-foreground text-sm mb-1">
                {previousValue} {operation}
              </div>
            )}
            <div className="text-5xl font-light text-foreground tabular-nums break-all">
              {display}
            </div>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <Button
            variant="function"
            onClick={handleClear}
            className="text-lg font-medium"
          >
            AC
          </Button>
          <Button
            variant="function"
            onClick={handleToggleSign}
            className="text-lg font-medium"
          >
            +/-
          </Button>
          <Button
            variant="function"
            onClick={handlePercentage}
            className="text-lg font-medium"
          >
            %
          </Button>
          <Button
            variant="operator"
            onClick={() => handleOperation("÷")}
            className="text-2xl font-light"
          >
            ÷
          </Button>

          {/* Row 2 */}
          <Button variant="number" onClick={() => handleNumber("7")} className="text-2xl font-light">
            7
          </Button>
          <Button variant="number" onClick={() => handleNumber("8")} className="text-2xl font-light">
            8
          </Button>
          <Button variant="number" onClick={() => handleNumber("9")} className="text-2xl font-light">
            9
          </Button>
          <Button
            variant="operator"
            onClick={() => handleOperation("×")}
            className="text-2xl font-light"
          >
            ×
          </Button>

          {/* Row 3 */}
          <Button variant="number" onClick={() => handleNumber("4")} className="text-2xl font-light">
            4
          </Button>
          <Button variant="number" onClick={() => handleNumber("5")} className="text-2xl font-light">
            5
          </Button>
          <Button variant="number" onClick={() => handleNumber("6")} className="text-2xl font-light">
            6
          </Button>
          <Button
            variant="operator"
            onClick={() => handleOperation("-")}
            className="text-2xl font-light"
          >
            -
          </Button>

          {/* Row 4 */}
          <Button variant="number" onClick={() => handleNumber("1")} className="text-2xl font-light">
            1
          </Button>
          <Button variant="number" onClick={() => handleNumber("2")} className="text-2xl font-light">
            2
          </Button>
          <Button variant="number" onClick={() => handleNumber("3")} className="text-2xl font-light">
            3
          </Button>
          <Button
            variant="operator"
            onClick={() => handleOperation("+")}
            className="text-2xl font-light"
          >
            +
          </Button>

          {/* Row 5 */}
          <Button
            variant="number"
            onClick={() => handleNumber("0")}
            className="col-span-2 text-2xl font-light"
          >
            0
          </Button>
          <Button variant="number" onClick={handleDecimal} className="text-2xl font-light">
            .
          </Button>
          <Button
            variant="operator"
            onClick={handleEquals}
            className="text-2xl font-light"
          >
            =
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Calculator;
