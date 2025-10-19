import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

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

    const systemPrompt = `You are a professional chef. Generate a recipe from provided ingredients.

CRITICAL: Return ONLY valid JSON, no markdown, no explanations. Use this exact structure:
{
  "title": "dish name",
  "summary": "1-2 sentence flavor description",
  "selected_ingredients": [{"name":"...", "qty":"...", "unit":"...", "role":"primary|supporting|aromatic|acid|fat|seasoning"}],
  "leftover_ingredients": ["..."],
  "extras_to_buy": ["..."],
  "equipment": ["..."],
  "steps": [{"n":1, "do":"...", "why":"...", "time":"~X min"}],
  "timing": {"prep_min": 10, "cook_min": 20, "total_min": 30},
  "servings": 2,
  "nutrition_estimate": {"kcal_per_serving": "~500", "protein_g":"~25", "carbs_g":"~40", "fat_g":"~15"},
  "subs_and_variations": ["..."],
  "image_prompt": "detailed visual description for image generation, no text overlay",
  "notes": ["safety tips, storage, etc"]
}

Rules:
- Select subset of ingredients that work well together
- Add max 3 common staples (salt, oil, pepper, water) if essential
- List unused ingredients in leftover_ingredients
- Be realistic with timing and nutrition estimates`;

    const userPrompt = `Ingredients: ${ingredients}${preferences ? `\nPreferences: ${preferences}` : ''}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits in Settings -> Workspace -> Usage.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`Lovable AI error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let recipeText = data.choices[0].message.content;
    console.log('Generated recipe text:', recipeText);

    // Clean markdown artifacts
    recipeText = recipeText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const recipeData = JSON.parse(recipeText);

    // Generate dish image
    let dishImage = null;
    try {
      const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages: [
            { role: 'user', content: recipeData.image_prompt || `A beautifully plated ${recipeData.title}, professional food photography, natural lighting, no text overlay` }
          ],
          modalities: ['image', 'text']
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        dishImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        console.log('Image generated successfully');
      }
    } catch (imageError) {
      console.error('Image generation failed:', imageError);
    }

    return new Response(JSON.stringify({ 
      recipe: recipeData,
      dishImage,
      status: 'ok'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-recipe function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      diag: {
        where: 'text-llm',
        hint: 'Check ingredient format and try again'
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
