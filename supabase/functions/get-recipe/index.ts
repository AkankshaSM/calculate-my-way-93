import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients, preferences } = await req.json();
    console.log('Received request:', { ingredients, preferences });

    const systemPrompt = `You are a professional chef and food historian. When given a list of ingredients and taste preferences, suggest a delicious recipe.

Format your response EXACTLY as follows:
DISH_NAME: [Name of the dish]
COOK_TIME: [e.g., 30 minutes]
INGREDIENTS:
- [ingredient 1 with quantity]
- [ingredient 2 with quantity]
- [continue list]

METHOD:
1. [First step]
2. [Second step]
3. [Continue steps]

FUN_FACT: [One interesting historical fact or cultural note about the dish]

IMAGE_PROMPT: [A detailed description for generating an image of the final dish, describing colors, plating, garnishes]`;

    const userPrompt = `I have these ingredients: ${ingredients}${preferences ? `\n\nMy taste preferences: ${preferences}` : ''}\n\nPlease suggest a recipe I can make.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-0301',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_completion_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} + ${errorText}`);
    }

    const data = await response.json();
    const recipeText = data.choices[0].message.content;
    console.log('Generated recipe:', recipeText);

    return new Response(JSON.stringify({ recipe: recipeText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-recipe function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
