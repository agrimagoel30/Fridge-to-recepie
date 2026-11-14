/**
 * Intelligent Mock Recipe Generator & Bad AI Output Simulator
 * Used when no API key is provided or when running in test/simulation mode.
 */

const RECIPE_PRESETS = [
  {
    triggers: ['egg', 'rice', 'onion', 'soy'],
    recipe: {
      id: 'mock-egg-fried-rice',
      title: 'Golden Garlic-Scallion Egg Fried Rice',
      tagline: 'Crispy wok-tossed comfort food in under 20 minutes',
      description: 'The ultimate pantry raid meal: cold leftover rice transformed into savory, aromatic fried rice with silky scrambled eggs and caramelized scallions.',
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      totalTimeMinutes: 15,
      servings: 2,
      difficulty: 'Easy',
      cuisine: 'East Asian',
      dietaryTags: ['Vegetarian Option', 'Quick & Easy', 'High-Protein'],
      matchedIngredients: ['Eggs', 'Leftover Rice', 'Onions', 'Soy sauce'],
      pantryStaplesNeeded: ['Cooking oil', 'Salt', 'Black pepper', 'Garlic (optional)'],
      ingredients: [
        {
          id: 'ing-1',
          name: 'Cooked rice (preferably chilled/day-old)',
          amount: 2,
          unit: 'cups',
          notes: 'Cold rice fries best without becoming mushy',
          isFromFridge: true,
          swaps: [
            { name: 'Riced Cauliflower', amount: 2, unit: 'cups', ratio: '1:1 ratio', impact: 'Low carb, cook 3 mins less' },
            { name: 'Cooked Quinoa', amount: 1.5, unit: 'cups', ratio: '3/4 cup per cup', impact: 'Nutty profile, higher fiber' }
          ]
        },
        {
          id: 'ing-2',
          name: 'Large eggs',
          amount: 3,
          unit: 'whole',
          notes: 'Beaten lightly with a pinch of salt',
          isFromFridge: true,
          swaps: [
            { name: 'Crumbled Firm Tofu', amount: 150, unit: 'grams', ratio: '150g per 3 eggs', impact: 'Vegan swap with turmeric for yellow color' },
            { name: 'Egg whites', amount: 4, unit: 'whole', ratio: '4 whites for 3 eggs', impact: 'Lower fat, lighter texture' }
          ]
        },
        {
          id: 'ing-3',
          name: 'Yellow onion or scallions',
          amount: 1,
          unit: 'medium',
          notes: 'Finely diced',
          isFromFridge: true,
          swaps: [
            { name: 'Shallots', amount: 2, unit: 'medium', ratio: '2 shallots for 1 onion', impact: 'Sweeter, more delicate aroma' },
            { name: 'Onion powder', amount: 1, unit: 'tsp', ratio: '1 tsp per onion', impact: 'Flavor only, no crunch' }
          ]
        },
        {
          id: 'ing-4',
          name: 'Soy sauce (or Tamari)',
          amount: 2,
          unit: 'tbsp',
          notes: 'Drizzle along wok edge for smoky aroma',
          isFromFridge: true,
          swaps: [
            { name: 'Coconut Aminos', amount: 2, unit: 'tbsp', ratio: '1:1 ratio', impact: 'Sweeter, soy-free and gluten-free' },
            { name: 'Fish sauce + Pinch of sugar', amount: 1, unit: 'tbsp', ratio: '1 tbsp for 2 tbsp soy', impact: 'More pungent umami punch' }
          ]
        },
        {
          id: 'ing-5',
          name: 'Toasted sesame oil (or neutral oil)',
          amount: 1,
          unit: 'tbsp',
          notes: 'For finishing drizzle',
          isFromFridge: false,
          swaps: [
            { name: 'Butter', amount: 1, unit: 'tbsp', ratio: '1:1 ratio', impact: 'Rich Japanese diner style fried rice' }
          ]
        }
      ],
      steps: [
        {
          stepNumber: 1,
          instruction: 'Heat 1 tbsp of oil in a wide skillet or wok over medium-high heat until shimmering. Add the beaten eggs and gently swirl for 45-60 seconds until softly set. Remove eggs to a clean plate.',
          durationMinutes: 2,
          temperature: 'Medium-high heat',
          proTip: 'Do not overcook the eggs here; they will cook more when tossed back in at the end.',
          ingredientsUsed: ['Large eggs']
        },
        {
          stepNumber: 2,
          instruction: 'Add another tablespoon of oil to the same pan. Toss in the diced onions and saute for 2 to 3 minutes until fragrant and lightly browned around the edges.',
          durationMinutes: 3,
          temperature: 'Medium heat',
          proTip: 'Letting onions caramelize slightly gives a deeper sweetness to the savory base.',
          ingredientsUsed: ['Yellow onion or scallions']
        },
        {
          stepNumber: 3,
          instruction: 'Crumble the cold cooked rice directly into the pan using your clean fingers or a wooden spatula to break up any clumps. Spread the rice across the pan surface.',
          durationMinutes: 1,
          temperature: 'High heat',
          proTip: 'Break up rice clumps before adding so each grain gets coated in oil and crisps evenly.',
          ingredientsUsed: ['Cooked rice']
        },
        {
          stepNumber: 4,
          instruction: 'Press the rice down and let it fry undisturbed for 2 minutes to create golden crispy grains. Then stir and flip.',
          durationMinutes: 2,
          temperature: 'High heat',
          proTip: 'That sizzle is the Maillard reaction giving the rice authentic restaurant flavor.',
          ingredientsUsed: ['Cooked rice']
        },
        {
          stepNumber: 5,
          instruction: 'Drizzle soy sauce around the outer perimeter of the skillet so it caramelizes before hitting the rice. Stir vigorously to distribute color and flavor evenly.',
          durationMinutes: 1,
          temperature: 'Medium-high heat',
          proTip: 'Pouring along the rim is called "wok hei" technique - it vapors off raw wateriness.',
          ingredientsUsed: ['Soy sauce']
        },
        {
          stepNumber: 6,
          instruction: 'Return the soft scrambled eggs to the pan, breaking them into bite-sized morsels with the edge of your spatula. Drizzle with sesame oil, toss for 30 seconds, and serve piping hot!',
          durationMinutes: 1,
          temperature: 'Off heat',
          proTip: 'Serve immediately with chili crisp or hot sauce if desired.',
          ingredientsUsed: ['Large eggs', 'Toasted sesame oil']
        }
      ],
      nutritionPerServing: {
        calories: 395,
        proteinGrams: 16,
        carbsGrams: 48,
        fatGrams: 14,
        fiberGrams: 3
      },
      chefTips: [
        'Always use dry, refrigerated rice. Freshly cooked warm rice will turn into a sticky porridge.',
        'Got leftover veggies like carrots, peas, or broccoli? Dice them small and sauté with the onions in Step 2.',
        'Store leftovers in a sealed glass container for up to 3 days; re-crisp in a hot skillet.'
      ],
      refinementsApplied: []
    }
  },
  {
    triggers: ['pasta', 'tomato', 'cheese', 'garlic'],
    recipe: {
      id: 'mock-rustic-pasta',
      title: 'Rustic Pan-Roasted Tomato & Garlic Pasta',
      tagline: 'Rich, glossy Mediterranean pasta using everyday staples',
      description: 'Burst cherry tomatoes create their own silky emulsion with starchy pasta water, enriched with melted cheese and toasted garlic slivers.',
      prepTimeMinutes: 10,
      cookTimeMinutes: 12,
      totalTimeMinutes: 22,
      servings: 2,
      difficulty: 'Easy',
      cuisine: 'Italian',
      dietaryTags: ['Vegetarian', 'Comfort Food', 'Mediterranean'],
      matchedIngredients: ['Pasta', 'Tomatoes', 'Garlic', 'Cheese'],
      pantryStaplesNeeded: ['Olive oil', 'Salt', 'Black pepper', 'Water'],
      ingredients: [
        {
          id: 'ing-1',
          name: 'Pasta (Spaghetti, Penne, or Rigatoni)',
          amount: 200,
          unit: 'grams',
          notes: 'Cook 1 minute shy of al dente',
          isFromFridge: true,
          swaps: [
            { name: 'Gluten-Free Pasta or Chickpea Pasta', amount: 200, unit: 'grams', ratio: '1:1 ratio', impact: 'Higher protein, watch cook time closely' },
            { name: 'Zucchini Noodles (Zoodles)', amount: 400, unit: 'grams', ratio: '2:1 ratio', impact: 'Low carb, toss in for only 60 seconds' }
          ]
        },
        {
          id: 'ing-2',
          name: 'Tomatoes (Cherry, plum, or canned diced)',
          amount: 300,
          unit: 'grams',
          notes: 'Halved or coarsely crushed',
          isFromFridge: true,
          swaps: [
            { name: 'Canned crushed tomatoes', amount: 1, unit: 'can (400g)', ratio: '1 can', impact: 'More saucy texture, simmer 3 mins longer' },
            { name: 'Roasted red peppers in oil', amount: 200, unit: 'grams', ratio: '200g', impact: 'Smoky, sweet variation' }
          ]
        },
        {
          id: 'ing-3',
          name: 'Garlic cloves',
          amount: 4,
          unit: 'cloves',
          notes: 'Thinly sliced, not minced, so it resists burning',
          isFromFridge: true,
          swaps: [
            { name: 'Garlic powder', amount: 1, unit: 'tsp', ratio: '1 tsp for 4 cloves', impact: 'Distributes evenly, less fresh pungency' }
          ]
        },
        {
          id: 'ing-4',
          name: 'Grated cheese (Parmesan, Cheddar, or Mozzarella)',
          amount: 50,
          unit: 'grams',
          notes: 'Freshly shredded melts best',
          isFromFridge: true,
          swaps: [
            { name: 'Nutritional yeast', amount: 3, unit: 'tbsp', ratio: '3 tbsp', impact: 'Cheesy vegan alternative rich in vitamin B12' }
          ]
        }
      ],
      steps: [
        {
          stepNumber: 1,
          instruction: 'Bring a pot of heavily salted water to a rolling boil. Drop pasta and cook for 8-9 minutes until just shy of al dente. Crucial: scoop out 1/2 cup of salty pasta water before draining!',
          durationMinutes: 9,
          temperature: 'Boiling',
          proTip: 'The starchy pasta cooking water is the secret ingredient that binds oil and sauce into restaurant gloss.',
          ingredientsUsed: ['Pasta']
        },
        {
          stepNumber: 2,
          instruction: 'While pasta cooks, warm 2 tbsp of olive oil in a skillet over low-medium heat. Add sliced garlic and cook gently for 2 minutes until blond and fragrant. Do not let it turn dark brown.',
          durationMinutes: 2,
          temperature: 'Low-Medium heat',
          proTip: 'Burnt garlic turns bitter; keep the heat gentle.',
          ingredientsUsed: ['Garlic cloves']
        },
        {
          stepNumber: 3,
          instruction: 'Turn heat up to medium-high and add the tomatoes with a pinch of salt. Cook for 5 minutes, pressing lightly with a wooden spoon until tomatoes burst and release their juices.',
          durationMinutes: 5,
          temperature: 'Medium-High heat',
          proTip: 'The acid from the tomatoes will naturally deglaze the savory garlic juices.',
          ingredientsUsed: ['Tomatoes']
        },
        {
          stepNumber: 4,
          instruction: 'Transfer drained pasta straight into the bubbling tomato skillet. Pour in 3-4 tablespoons of reserved pasta water and toss vigorously for 1 minute.',
          durationMinutes: 1,
          temperature: 'Medium heat',
          proTip: 'Keep swirling the pan - agitation emulsifies oil and starch.',
          ingredientsUsed: ['Pasta']
        },
        {
          stepNumber: 5,
          instruction: 'Remove skillet from heat. Scatter grated cheese and freshly cracked black pepper. Toss continuously until melted into a luscious coating. Plate immediately.',
          durationMinutes: 1,
          temperature: 'Off heat',
          proTip: 'Adding cheese off the heat prevents stringy clumping.',
          ingredientsUsed: ['Grated cheese']
        }
      ],
      nutritionPerServing: {
        calories: 480,
        proteinGrams: 18,
        carbsGrams: 64,
        fatGrams: 16,
        fiberGrams: 6
      },
      chefTips: [
        'Fresh basil or dried oregano tossed in right at the end takes this to gourmet level.',
        'If the sauce feels too dry, splash another tablespoon of warm pasta water.'
      ],
      refinementsApplied: []
    }
  }
];

/**
 * Builds a dynamic smart recipe from whatever ingredients the user listed.
 */
export function generateMockRecipe(promptText, refinement = null, baseRecipe = null) {
  // If this is a refinement request on an existing recipe
  if (refinement && baseRecipe) {
    const refined = JSON.parse(JSON.stringify(baseRecipe));
    refined.id = `recipe-refined-${Date.now()}`;
    refined.refinementsApplied = [...(refined.refinementsApplied || []), refinement];

    const lowerRef = refinement.toLowerCase();
    if (lowerRef.includes('spicy') || lowerRef.includes('heat') || lowerRef.includes('chili')) {
      refined.title = `Spicy ${refined.title}`;
      refined.tagline = `${refined.tagline} (with an extra chili kick)`;
      refined.dietaryTags = [...new Set([...refined.dietaryTags, 'Spicy'])];
      refined.pantryStaplesNeeded = [...new Set([...refined.pantryStaplesNeeded, 'Red chili flakes / Sriracha'])];
      refined.steps.splice(2, 0, {
        stepNumber: 3,
        instruction: 'Add 1 teaspoon of red pepper flakes or hot sauce to the pan, letting the spice bloom in the hot oil for 30 seconds.',
        durationMinutes: 1,
        temperature: 'Medium heat',
        proTip: 'Blooming chilies in hot oil extracts oil-soluble capsaicin for deeper, rounded heat.',
        ingredientsUsed: []
      });
      // Renumber steps
      refined.steps = refined.steps.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    } else if (lowerRef.includes('vegan') || lowerRef.includes('dairy-free')) {
      refined.title = `Plant-Powered ${refined.title}`;
      refined.dietaryTags = [...new Set([...refined.dietaryTags, '100% Vegan', 'Dairy-Free'])];
      refined.ingredients = refined.ingredients.map(ing => {
        if (ing.name.toLowerCase().includes('egg') || ing.name.toLowerCase().includes('cheese') || ing.name.toLowerCase().includes('butter')) {
          const swap = ing.swaps[0] || { name: 'Plant-based alternative', amount: ing.amount, unit: ing.unit };
          return {
            ...ing,
            name: `${swap.name} (Vegan swap)`,
            notes: `Substituted for ${ing.name}`
          };
        }
        return ing;
      });
    } else if (lowerRef.includes('quick') || lowerRef.includes('15') || lowerRef.includes('fast')) {
      refined.title = `15-Minute Express ${refined.title}`;
      refined.prepTimeMinutes = Math.max(3, Math.round(refined.prepTimeMinutes * 0.6));
      refined.cookTimeMinutes = Math.max(7, Math.round(refined.cookTimeMinutes * 0.6));
      refined.totalTimeMinutes = refined.prepTimeMinutes + refined.cookTimeMinutes;
      refined.dietaryTags = [...new Set([...refined.dietaryTags, 'Super Express'])];
    } else {
      refined.title = `${refined.title} (Customized)`;
      refined.chefTips.push(`Customized to your preference: "${refinement}"`);
    }
    return refined;
  }

  // Parse prompt words to match best preset or construct custom
  const cleanPrompt = (promptText || '').toLowerCase();

  for (const preset of RECIPE_PRESETS) {
    const hits = preset.triggers.filter(tr => cleanPrompt.includes(tr));
    if (hits.length >= 2) {
      const copy = JSON.parse(JSON.stringify(preset.recipe));
      copy.id = `recipe-${Date.now()}`;
      return copy;
    }
  }

  // Fallback dynamic generator: extracts items from prompt
  const rawItems = promptText
    .split(/,|\n|and|\+/)
    .map(s => s.trim())
    .filter(s => s.length > 1 && !['i', 'have', 'some', 'a', 'the', 'in', 'my', 'fridge'].includes(s.toLowerCase()));

  const mainItem = rawItems[0] || 'Crispy Garden Medley';
  const secondItem = rawItems[1] || 'Skillet Toss';

  return {
    id: `recipe-${Date.now()}`,
    title: `Sautéed ${mainItem.charAt(0).toUpperCase() + mainItem.slice(1)} & ${secondItem.charAt(0).toUpperCase() + secondItem.slice(1)} Skillet`,
    tagline: `A wholesome, zero-waste one-pan dish made from what you have on hand`,
    description: `Designed specifically for your fridge inventory (${rawItems.join(', ')}). Balanced with aromatic seasoning, tender-crisp textures, and rich pantry flavors.`,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    totalTimeMinutes: 25,
    servings: 2,
    difficulty: 'Easy',
    cuisine: 'Comfort Bistro',
    dietaryTags: ['Custom Fridge Raid', 'One-Pan Meal', 'High-Fiber'],
    matchedIngredients: rawItems.length > 0 ? rawItems : ['Pantry mix'],
    pantryStaplesNeeded: ['Olive oil or butter', 'Garlic', 'Salt', 'Black pepper', 'Lemon wedge'],
    ingredients: rawItems.length > 0 ? rawItems.map((item, idx) => ({
      id: `ing-${idx + 1}`,
      name: item.charAt(0).toUpperCase() + item.slice(1),
      amount: idx === 0 ? 250 : idx === 1 ? 2 : 1,
      unit: idx === 0 ? 'grams' : 'cups',
      notes: 'Cleaned and cut into uniform bite-sized pieces',
      isFromFridge: true,
      swaps: [
        {
          name: `Any seasonal greens or mushrooms`,
          amount: 1,
          unit: 'cup',
          ratio: '1:1 ratio',
          impact: 'Provides similar moisture and earthiness'
        }
      ]
    })) : [
      {
        id: 'ing-1',
        name: 'Vegetable medley',
        amount: 300,
        unit: 'grams',
        notes: 'Chopped',
        isFromFridge: true,
        swaps: [{ name: 'Frozen stir-fry mix', amount: 300, unit: 'grams', ratio: '1:1', impact: 'No thawing needed' }]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: `Prep your ingredients: wash and dice ${rawItems.slice(0, 3).join(', ') || 'ingredients'} into uniform bite-sized pieces for even cooking.`,
        durationMinutes: 5,
        temperature: 'Prep counter',
        proTip: 'Uniform cuts ensure that everything finishes cooking at the exact same minute without burning.',
        ingredientsUsed: rawItems.slice(0, 3)
      },
      {
        stepNumber: 2,
        instruction: 'Heat 2 tablespoons of oil or butter in a wide heavy-bottomed skillet over medium-high heat until shimmering.',
        durationMinutes: 2,
        temperature: 'Medium-high heat',
        proTip: 'Test the pan readiness by holding your palm 3 inches above; you should feel steady radiating heat.',
        ingredientsUsed: []
      },
      {
        stepNumber: 3,
        instruction: `Add ${rawItems[0] || 'the primary ingredient'} to the hot skillet in a single layer. Sear for 4 minutes without moving to develop a deep golden crust.`,
        durationMinutes: 4,
        temperature: 'Medium-high heat',
        proTip: 'Resist the urge to stir immediately! Caramelization needs uninterrupted contact with the hot metal.',
        ingredientsUsed: [rawItems[0] || 'Primary ingredient']
      },
      {
        stepNumber: 4,
        instruction: `Toss in ${rawItems.slice(1).join(', ') || 'remaining ingredients'}, season with a pinch of salt and freshly cracked pepper. Sauté for 5 to 7 minutes until fork-tender.`,
        durationMinutes: 6,
        temperature: 'Medium heat',
        proTip: 'Cover the skillet with a lid for 2 minutes if you need to steam harder veggies like broccoli or carrots.',
        ingredientsUsed: rawItems.slice(1)
      },
      {
        stepNumber: 5,
        instruction: 'Finish with a squeeze of fresh lemon juice or a dash of vinegar to wake up all the flavors. Adjust seasoning to taste and serve immediately.',
        durationMinutes: 1,
        temperature: 'Off heat',
        proTip: 'Acid cuts through the rich oil and elevates the natural sweetness of sautéed vegetables.',
        ingredientsUsed: []
      }
    ],
    nutritionPerServing: {
      calories: 360,
      proteinGrams: 14,
      carbsGrams: 32,
      fatGrams: 12,
      fiberGrams: 5
    },
    chefTips: [
      'Garnish with toasted nuts, seeds, or a dollop of Greek yogurt for added crunch and texture.',
      'Pairs wonderfully with warm crusty bread, steamed grains, or a fried egg on top.'
    ],
    refinementsApplied: []
  };
}
