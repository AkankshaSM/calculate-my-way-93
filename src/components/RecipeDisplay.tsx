import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, ShoppingCart } from "lucide-react";

interface RecipeDisplayProps {
  recipe: any;
  dishImage?: string;
}

const RecipeDisplay = ({ recipe, dishImage }: RecipeDisplayProps) => {
  if (!recipe) return null;

  return (
    <Card className="mt-6 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{recipe.title}</CardTitle>
        <p className="text-muted-foreground">{recipe.summary}</p>
        
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{recipe.timing.total_min} min total</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center gap-2">
            <ChefHat className="w-4 h-4" />
            <span>~{recipe.nutrition_estimate.kcal_per_serving} cal/serving</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {dishImage && (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={dishImage} 
              alt={`Plated ${recipe.title}`}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <div>
          <h3 className="font-semibold text-lg mb-3">Selected Ingredients</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recipe.selected_ingredients.map((ing: any, idx: number) => (
              <div key={idx} className="flex items-baseline gap-2">
                <Badge variant="outline" className="text-xs">{ing.role}</Badge>
                <span className="text-sm">{ing.qty} {ing.unit} {ing.name}</span>
              </div>
            ))}
          </div>
        </div>

        {recipe.leftover_ingredients?.length > 0 && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Leftover Ingredients</h4>
            <p className="text-sm text-muted-foreground">{recipe.leftover_ingredients.join(', ')}</p>
          </div>
        )}

        {recipe.extras_to_buy?.length > 0 && (
          <div className="bg-primary/5 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-4 h-4" />
              <h4 className="font-medium text-sm">You'll need to buy</h4>
            </div>
            <p className="text-sm">{recipe.extras_to_buy.join(', ')}</p>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-lg mb-3">Equipment</h3>
          <div className="flex flex-wrap gap-2">
            {recipe.equipment.map((item: string, idx: number) => (
              <Badge key={idx} variant="secondary">{item}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Instructions</h3>
          <ol className="space-y-4">
            {recipe.steps.map((step: any) => (
              <li key={step.n} className="flex gap-3">
                <span className="font-bold text-primary min-w-6">{step.n}.</span>
                <div className="flex-1">
                  <p className="text-sm mb-1">{step.do}</p>
                  {step.why && <p className="text-xs text-muted-foreground italic">{step.why}</p>}
                  {step.time && <p className="text-xs text-muted-foreground">{step.time}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {recipe.subs_and_variations?.length > 0 && (
          <div className="bg-secondary/5 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Variations & Substitutions</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {recipe.subs_and_variations.map((sub: string, idx: number) => (
                <li key={idx}>{sub}</li>
              ))}
            </ul>
          </div>
        )}

        {recipe.notes?.length > 0 && (
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-sm mb-2">Notes</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {recipe.notes.map((note: string, idx: number) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-muted/30 p-3 rounded-lg text-xs text-muted-foreground">
          <strong>Nutrition (per serving):</strong> 
          {' '}{recipe.nutrition_estimate.kcal_per_serving} kcal, 
          {' '}P: {recipe.nutrition_estimate.protein_g}g, 
          {' '}C: {recipe.nutrition_estimate.carbs_g}g, 
          {' '}F: {recipe.nutrition_estimate.fat_g}g
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeDisplay;
