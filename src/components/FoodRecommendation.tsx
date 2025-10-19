import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChefHat } from "lucide-react";
import RecipeDisplay from "./RecipeDisplay";

const FoodRecommendation = () => {
  const [ingredients, setIngredients] = useState("");
  const [preferences, setPreferences] = useState("");
  const [recipe, setRecipe] = useState<any>(null);
  const [dishImage, setDishImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ingredients.trim()) {
      toast({
        title: "Missing ingredients",
        description: "Please enter at least some ingredients",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRecipe(null);
    setDishImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('get-recipe', {
        body: { ingredients, preferences }
      });

      if (error) throw error;

      setRecipe(data.recipe);
      setDishImage(data.dishImage || null);
      toast({
        title: "Recipe generated!",
        description: "Enjoy your cooking adventure",
      });
    } catch (error) {
      console.error('Error getting recipe:', error);
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Recipe Finder!
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Tell us what ingredients you have, and we'll suggest delicious recipes!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>What's in your kitchen?</CardTitle>
              <CardDescription>
                Enter your available ingredients and taste preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ingredients">Ingredients *</Label>
                  <Textarea
                    id="ingredients"
                    placeholder="e.g., chicken, tomatoes, onions, garlic, pasta..."
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferences">Taste Preferences (Optional)</Label>
                  <Input
                    id="preferences"
                    placeholder="e.g., spicy, sweet, vegetarian, low-carb..."
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Recipe...
                    </>
                  ) : (
                    "Get Recipe Suggestions"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {recipe && <RecipeDisplay recipe={recipe} dishImage={dishImage || undefined} />}
        </div>
      </div>
    </div>
  );
};

export default FoodRecommendation;
