import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Lightbulb, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface RecipeDisplayProps {
  recipe: string;
}

interface ParsedRecipe {
  dishName: string;
  cookTime: string;
  ingredients: string[];
  method: string[];
  funFact: string;
  imagePrompt: string;
}

const RecipeDisplay = ({ recipe }: RecipeDisplayProps) => {
  const [parsed, setParsed] = useState<ParsedRecipe | null>(null);

  useEffect(() => {
    const parseRecipe = () => {
      const lines = recipe.split('\n');
      const result: ParsedRecipe = {
        dishName: '',
        cookTime: '',
        ingredients: [],
        method: [],
        funFact: '',
        imagePrompt: ''
      };

      let currentSection = '';

      lines.forEach(line => {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('DISH_NAME:')) {
          result.dishName = trimmed.replace('DISH_NAME:', '').trim();
        } else if (trimmed.startsWith('COOK_TIME:')) {
          result.cookTime = trimmed.replace('COOK_TIME:', '').trim();
        } else if (trimmed.startsWith('INGREDIENTS:')) {
          currentSection = 'ingredients';
        } else if (trimmed.startsWith('METHOD:')) {
          currentSection = 'method';
        } else if (trimmed.startsWith('FUN_FACT:')) {
          result.funFact = trimmed.replace('FUN_FACT:', '').trim();
          currentSection = '';
        } else if (trimmed.startsWith('IMAGE_PROMPT:')) {
          result.imagePrompt = trimmed.replace('IMAGE_PROMPT:', '').trim();
          currentSection = '';
        } else if (trimmed && currentSection === 'ingredients' && trimmed.startsWith('-')) {
          result.ingredients.push(trimmed.substring(1).trim());
        } else if (trimmed && currentSection === 'method' && /^\d+\./.test(trimmed)) {
          result.method.push(trimmed.replace(/^\d+\.\s*/, ''));
        }
      });

      setParsed(result);
    };

    parseRecipe();
  }, [recipe]);

  if (!parsed) return null;

  return (
    <Card className="border-2 md:col-span-1">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{parsed.dishName || 'Your Recipe'}</CardTitle>
        {parsed.cookTime && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{parsed.cookTime}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {parsed.imagePrompt && (
          <div className="bg-muted/50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Dish Visualization</h3>
            </div>
            <p className="text-sm text-muted-foreground italic">{parsed.imagePrompt}</p>
          </div>
        )}

        {parsed.ingredients.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3">Ingredients Needed</h3>
            <ul className="space-y-2">
              {parsed.ingredients.map((ingredient, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {parsed.method.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3">Cooking Method</h3>
            <ol className="space-y-3">
              {parsed.method.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="font-bold text-primary min-w-[1.5rem]">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {parsed.funFact && (
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Fun Fact</h3>
                <p className="text-sm">{parsed.funFact}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeDisplay;
