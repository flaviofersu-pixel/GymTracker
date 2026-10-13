import type { MealIdeaId } from '../data/meals';

export interface MealIdeaCopy {
  name: string;
  /** Household amounts, one ingredient per line. */
  ingredients: string[];
}

export const mealIdeasEn = {
  // Breakfast
  oatsBananaPeanutButter: {
    name: 'Oats with banana and peanut butter',
    ingredients: ['80 g oats', '300 ml whole milk', '1 banana', '1 tbsp peanut butter'],
  },
  eggsOnToast: {
    name: 'Eggs on toast',
    ingredients: ['3 eggs', '2 slices wholemeal bread', '10 g butter', '1 tomato'],
  },
  yogurtGranolaBowl: {
    name: 'Greek yogurt bowl',
    ingredients: ['250 g Greek yogurt (2%)', '40 g granola', '100 g berries', '1 tsp honey'],
  },
  tomatoToastHam: {
    name: 'Tomato toast with ham',
    ingredients: ['2 slices bread', '1 grated tomato', '1 tbsp olive oil', '60 g serrano ham'],
  },
  overnightOats: {
    name: 'Overnight oats',
    ingredients: [
      '60 g oats',
      '150 g Greek yogurt (2%)',
      '150 ml semi-skimmed milk',
      '1 tbsp chia seeds',
      '100 g berries',
    ],
  },
  proteinPancakes: {
    name: 'Protein pancakes',
    ingredients: ['60 g oats', '2 eggs', '1 banana', '1 scoop whey (30 g)', '1 tsp honey'],
  },
  scrambledEggsAvocado: {
    name: 'Scrambled eggs with avocado',
    ingredients: ['3 eggs', '½ avocado', '2 slices wholemeal bread', '5 g butter'],
  },
  salmonBagel: {
    name: 'Smoked salmon bagel',
    ingredients: ['1 bagel', '30 g light cream cheese', '60 g smoked salmon', 'Capers and lemon'],
  },
  skyrMuesli: {
    name: 'Skyr with muesli and apple',
    ingredients: ['250 g skyr', '40 g muesli', '1 chopped apple'],
  },
  veggieOmelette: {
    name: 'Vegetable and feta omelette',
    ingredients: [
      '3 eggs',
      'Pepper, spinach and onion',
      '30 g feta',
      '1 slice bread',
      '1 tsp olive oil',
    ],
  },
  frenchToast: {
    name: 'French toast with berries',
    ingredients: [
      '2 slices bread',
      '2 eggs',
      '100 ml semi-skimmed milk',
      '5 g butter',
      '100 g berries and 1 tbsp honey',
    ],
  },
  breakfastBurrito: {
    name: 'Breakfast burrito',
    ingredients: [
      '1 large tortilla',
      '3 scrambled eggs',
      '60 g black beans',
      '30 g cheese',
      'Salsa',
    ],
  },
  cottageCheeseToast: {
    name: 'Cottage cheese on toast',
    ingredients: [
      '2 slices wholemeal bread',
      '150 g cottage cheese',
      '1 sliced tomato',
      '1 tsp olive oil',
    ],
  },
  chiaPudding: {
    name: 'Protein chia pudding',
    ingredients: [
      '30 g chia seeds',
      '250 ml semi-skimmed milk',
      '1 scoop whey (30 g)',
      '100 g mango',
    ],
  },
  peanutButterBananaToast: {
    name: 'Peanut butter and banana toast',
    ingredients: [
      '2 slices wholemeal bread',
      '2 tbsp peanut butter',
      '1 banana',
      '1 glass semi-skimmed milk (250 ml)',
    ],
  },
  smoothieBowl: {
    name: 'Berry smoothie bowl',
    ingredients: [
      '150 g frozen berries',
      '1 frozen banana',
      '150 g Greek yogurt (2%)',
      '30 g granola',
      '15 g pumpkin seeds',
    ],
  },
  hamCheeseToastie: {
    name: 'Ham and cheese toastie',
    ingredients: [
      '2 slices bread',
      '60 g cooked ham',
      '30 g cheese',
      '5 g butter',
      '1 glass semi-skimmed milk (250 ml)',
    ],
  },
  eggMuffins: {
    name: 'Baked egg muffins',
    ingredients: [
      '4 eggs',
      '40 g cooked ham',
      '30 g cheese',
      'Pepper and spinach',
      '1 slice bread',
    ],
  },
  quarkBerriesWalnuts: {
    name: 'Quark with berries and walnuts',
    ingredients: ['250 g quark (0%)', '100 g berries', '20 g walnuts', '1 tsp honey'],
  },
  shakshuka: {
    name: 'Shakshuka',
    ingredients: [
      '3 eggs',
      '200 g crushed tomato',
      '½ pepper and ½ onion',
      '1 tbsp olive oil',
      '1 slice bread',
    ],
  },

  // Lunch
  chickenRiceVeg: {
    name: 'Chicken, rice and vegetables',
    ingredients: [
      '150 g chicken breast',
      '75 g rice (dry)',
      '150 g mixed vegetables',
      '1 tbsp olive oil',
    ],
  },
  tunaTomatoPasta: {
    name: 'Tuna and tomato pasta',
    ingredients: [
      '100 g pasta (dry)',
      '2 cans tuna in water',
      '200 g crushed tomato',
      '1 tbsp olive oil',
    ],
  },
  lentilStew: {
    name: 'Lentil stew',
    ingredients: ['80 g lentils (dry)', '1 carrot and ½ onion', '50 g chorizo', '1 tsp olive oil'],
  },
  chickenWrap: {
    name: 'Chicken wraps',
    ingredients: [
      '2 large tortillas',
      '120 g cooked chicken',
      '30 g grated cheese',
      'Lettuce, tomato and 1 tbsp yogurt sauce',
    ],
  },
  chickenCaesarSalad: {
    name: 'Chicken Caesar salad',
    ingredients: [
      '150 g chicken breast',
      'Romaine lettuce',
      '20 g parmesan',
      '30 g croutons',
      '2 tbsp light Caesar dressing',
    ],
  },
  turkeyMeatballPasta: {
    name: 'Turkey meatball pasta',
    ingredients: [
      '150 g turkey mince',
      '90 g pasta (dry)',
      '200 g tomato sauce',
      '10 g parmesan',
      '1 tsp olive oil',
    ],
  },
  chickpeaTunaSalad: {
    name: 'Chickpea and tuna salad',
    ingredients: [
      '1 can chickpeas (drained)',
      '1 can tuna in water',
      'Cucumber, tomato and red onion',
      '30 g feta',
      '1 tbsp olive oil',
    ],
  },
  beefBurritoBowl: {
    name: 'Beef burrito bowl',
    ingredients: [
      '150 g lean beef mince (5%)',
      '60 g rice (dry)',
      '80 g black beans',
      '50 g sweetcorn',
      'Lettuce and salsa',
      '30 g grated cheese',
    ],
  },
  salmonPokeBowl: {
    name: 'Salmon poke bowl',
    ingredients: [
      '120 g fresh salmon',
      '70 g sushi rice (dry)',
      '75 g edamame',
      'Cucumber and carrot',
      '1 tbsp soy sauce and 1 tsp sesame oil',
    ],
  },
  chickenQuinoaBowl: {
    name: 'Chicken and quinoa bowl',
    ingredients: [
      '150 g chicken breast',
      '60 g quinoa (dry)',
      '150 g roasted vegetables',
      '30 g feta',
      '1 tbsp olive oil',
    ],
  },
  spanishOmelette: {
    name: 'Spanish omelette with salad',
    ingredients: ['3 eggs', '200 g potatoes', '½ onion', '1½ tbsp olive oil', 'Green salad'],
  },
  chickenCurry: {
    name: 'Chicken curry with rice',
    ingredients: [
      '150 g chicken breast',
      '70 g basmati rice (dry)',
      '100 ml light coconut milk',
      'Onion and pepper',
      '1 tbsp curry paste and 1 tsp oil',
    ],
  },
  tunaBaguette: {
    name: 'Tuna baguette',
    ingredients: [
      '½ baguette',
      '1 can tuna in water',
      '1 tbsp light mayonnaise',
      'Lettuce and tomato',
    ],
  },
  pestoChickenPasta: {
    name: 'Pesto chicken pasta',
    ingredients: [
      '90 g pasta (dry)',
      '120 g chicken breast',
      '1½ tbsp pesto',
      'Cherry tomatoes',
      '10 g parmesan',
    ],
  },
  chickpeaSpinachStew: {
    name: 'Chickpeas with spinach and egg',
    ingredients: [
      '1 can chickpeas (drained)',
      '100 g spinach',
      '2 boiled eggs',
      '1 tbsp olive oil, garlic and paprika',
      '1 slice bread',
    ],
  },
  chickenFajitas: {
    name: 'Chicken fajitas',
    ingredients: [
      '150 g chicken breast',
      '3 small tortillas',
      '1 pepper and 1 onion',
      '1 tbsp oil',
      '2 tbsp natural yogurt',
    ],
  },
  jacketPotatoTuna: {
    name: 'Jacket potato with tuna',
    ingredients: [
      '1 large potato (300 g)',
      '1 can tuna in water',
      '50 g sweetcorn',
      '30 g grated cheese',
      '1 tbsp light mayonnaise',
    ],
  },
  greekChickenPita: {
    name: 'Greek chicken pita',
    ingredients: [
      '1 pita bread',
      '130 g chicken breast',
      '3 tbsp tzatziki',
      'Tomato, cucumber and onion',
      '30 g feta',
    ],
  },
  turkeyChili: {
    name: 'Turkey chili with rice',
    ingredients: [
      '150 g turkey mince',
      '120 g kidney beans',
      '200 g crushed tomato',
      'Onion and pepper',
      '60 g rice (dry)',
      '1 tsp oil',
    ],
  },
  shrimpFriedRice: {
    name: 'Prawn fried rice',
    ingredients: [
      '150 g prawns',
      '70 g rice (dry)',
      '2 eggs',
      '100 g peas and carrot',
      '1 tbsp soy sauce and 1 tbsp oil',
    ],
  },

  // Dinner
  salmonPotatoes: {
    name: 'Salmon with potatoes',
    ingredients: [
      '150 g salmon fillet',
      '250 g potatoes',
      '150 g green beans or broccoli',
      '1 tsp olive oil',
    ],
  },
  beefStirFry: {
    name: 'Beef stir-fry',
    ingredients: [
      '150 g lean beef strips',
      '75 g noodles or rice (dry)',
      '150 g stir-fry vegetables',
      '1 tbsp soy sauce and 1 tbsp oil',
    ],
  },
  omeletteSalad: {
    name: 'Cheese omelette with salad',
    ingredients: [
      '3 eggs and 2 egg whites',
      '30 g cheese',
      'Salad with 1 tbsp olive oil',
      '1 slice bread',
    ],
  },
  hakeRice: {
    name: 'Hake with rice',
    ingredients: [
      '200 g hake or white fish',
      '60 g rice (dry)',
      '150 g vegetables',
      '1 tbsp olive oil',
    ],
  },
  chickenSweetPotato: {
    name: 'Chicken with sweet potato',
    ingredients: [
      '150 g chicken breast',
      '250 g sweet potato',
      '150 g broccoli',
      '1 tbsp olive oil',
    ],
  },
  steakPotatoes: {
    name: 'Steak with potatoes and salad',
    ingredients: ['180 g sirloin steak', '200 g potatoes', 'Green salad', '1 tbsp olive oil'],
  },
  codRoastVeg: {
    name: 'Cod with roasted vegetables',
    ingredients: [
      '200 g cod fillet',
      '200 g potatoes',
      '150 g peppers and courgette',
      '1 tbsp olive oil',
    ],
  },
  turkeyBurger: {
    name: 'Turkey burger',
    ingredients: [
      '150 g turkey burger',
      '1 wholemeal bun',
      '1 slice cheese',
      'Lettuce and tomato',
      '1 tbsp ketchup',
    ],
  },
  prawnPasta: {
    name: 'Garlic prawn pasta',
    ingredients: [
      '90 g pasta (dry)',
      '150 g prawns',
      '1 tbsp olive oil and garlic',
      'Cherry tomatoes, chilli and parsley',
    ],
  },
  tofuStirFry: {
    name: 'Tofu stir-fry with rice',
    ingredients: [
      '200 g firm tofu',
      '150 g stir-fry vegetables',
      '70 g rice (dry)',
      '1 tbsp soy sauce and 1 tsp sesame oil',
    ],
  },
  porkTenderloinRice: {
    name: 'Pork tenderloin with rice',
    ingredients: [
      '150 g pork tenderloin',
      '60 g rice (dry)',
      '150 g green beans',
      '1 tbsp olive oil',
    ],
  },
  tortillaPizza: {
    name: 'Tortilla pizza',
    ingredients: [
      '1 large tortilla',
      '3 tbsp tomato sauce',
      '80 g light mozzarella',
      '60 g cooked ham',
      'Mushrooms and 1 tsp olive oil',
    ],
  },
  chickenNoodleSoup: {
    name: 'Chicken noodle soup',
    ingredients: [
      '150 g chicken breast',
      '50 g noodles (dry)',
      '500 ml chicken stock',
      'Carrot and celery',
    ],
  },
  meatballsMash: {
    name: 'Beef meatballs with mash',
    ingredients: [
      '150 g lean beef mince (5%)',
      '200 g tomato sauce',
      '250 g potatoes mashed with 50 ml milk',
      '1 tsp olive oil',
    ],
  },
  teriyakiSalmon: {
    name: 'Teriyaki salmon with rice',
    ingredients: [
      '130 g salmon fillet',
      '60 g rice (dry)',
      '150 g broccoli',
      '1 tbsp teriyaki sauce',
    ],
  },
  chickenTraybake: {
    name: 'Chicken thigh traybake',
    ingredients: [
      '200 g skinless chicken thighs',
      '250 g potatoes',
      '1 pepper and 1 onion',
      '1 tbsp olive oil',
    ],
  },
  stuffedPeppers: {
    name: 'Beef-stuffed peppers',
    ingredients: [
      '2 peppers',
      '120 g lean beef mince (5%)',
      '50 g rice (dry)',
      '100 g crushed tomato',
      '30 g grated cheese',
    ],
  },
  tunaSteakQuinoa: {
    name: 'Tuna steak with quinoa',
    ingredients: ['150 g tuna steak', '60 g quinoa (dry)', 'Salad with 1 tbsp olive oil'],
  },
  beefStew: {
    name: 'Beef and vegetable stew',
    ingredients: [
      '180 g lean stewing beef',
      '200 g potatoes',
      'Carrot and onion',
      '1 tbsp olive oil',
    ],
  },
  chickenQuesadilla: {
    name: 'Chicken quesadilla',
    ingredients: [
      '2 large tortillas',
      '100 g cooked chicken',
      '40 g grated cheese',
      '50 g black beans',
      'Salsa',
    ],
  },

  // Snacks
  cottageCheeseFruit: {
    name: 'Cottage cheese with fruit',
    ingredients: ['200 g cottage cheese', '1 peach or 150 g pineapple'],
  },
  turkeySandwich: {
    name: 'Turkey and cheese sandwich',
    ingredients: ['2 slices bread', '60 g sliced turkey', '1 slice cheese'],
  },
  almondsApple: {
    name: 'Almonds and an apple',
    ingredients: ['30 g almonds', '1 apple'],
  },
  boiledEggsHummus: {
    name: 'Boiled eggs with hummus',
    ingredients: ['2 boiled eggs', '2 tbsp hummus', 'Carrot sticks'],
  },
  greekYogurtHoney: {
    name: 'Greek yogurt with honey and walnuts',
    ingredients: ['200 g Greek yogurt (2%)', '1 tsp honey', '15 g walnuts'],
  },
  proteinBar: {
    name: 'Protein bar',
    ingredients: ['1 protein bar (about 60 g)'],
  },
  riceCakesPeanutButter: {
    name: 'Rice cakes with peanut butter',
    ingredients: ['3 rice cakes', '1½ tbsp peanut butter'],
  },
  beefJerky: {
    name: 'Beef jerky',
    ingredients: ['40 g beef jerky'],
  },
  edamame: {
    name: 'Edamame',
    ingredients: ['150 g shelled edamame', 'Pinch of sea salt'],
  },
  hummusVeggies: {
    name: 'Hummus with vegetables and pita',
    ingredients: ['4 tbsp hummus', 'Carrot, cucumber and pepper sticks', '1 small pita'],
  },
  tunaCrackers: {
    name: 'Tuna on crackers',
    ingredients: ['1 can tuna in water', '6 wholegrain crackers'],
  },
  bananaPeanutButter: {
    name: 'Banana with peanut butter',
    ingredients: ['1 banana', '1 tbsp peanut butter'],
  },
  cheeseGrapes: {
    name: 'Cheese and grapes',
    ingredients: ['40 g cheese', '150 g grapes'],
  },
  trailMix: {
    name: 'Trail mix',
    ingredients: ['25 g mixed nuts', '15 g raisins'],
  },
  chocolateMilk: {
    name: 'Glass of chocolate milk',
    ingredients: ['300 ml semi-skimmed milk', '1 tbsp cocoa and 1 tsp sugar'],
  },
  skyrBerries: {
    name: 'Skyr with berries',
    ingredients: ['1 pot of skyr (150 g)', '50 g berries'],
  },
  hamCheeseRollUps: {
    name: 'Ham and cheese roll-ups',
    ingredients: ['60 g cooked ham', '40 g sliced cheese'],
  },
  avocadoEggToast: {
    name: 'Avocado toast with egg',
    ingredients: ['1 slice wholemeal bread', '½ avocado', '1 boiled egg'],
  },
  darkChocolateAlmonds: {
    name: 'Dark chocolate and almonds',
    ingredients: ['20 g dark chocolate (70%+)', '15 g almonds'],
  },
  chocolateQuark: {
    name: 'Chocolate quark',
    ingredients: ['200 g quark (0%)', '1 tbsp cocoa powder', '1 tsp honey'],
  },

  // Shakes
  bulkShake: {
    name: 'Oat and banana shake',
    ingredients: ['400 ml whole milk', '60 g oats', '1 banana', '1 tbsp peanut butter'],
  },
  wheyBananaShake: {
    name: 'Whey and banana shake',
    ingredients: ['1 scoop whey (30 g)', '300 ml semi-skimmed milk', '1 banana'],
  },
  berryYogurtShake: {
    name: 'Berry and yogurt shake',
    ingredients: [
      '200 g Greek yogurt',
      '150 g frozen berries',
      '200 ml semi-skimmed milk',
      '1 tsp honey',
    ],
  },
  chocolatePeanutShake: {
    name: 'Chocolate peanut shake',
    ingredients: [
      '1 scoop chocolate whey (30 g)',
      '300 ml whole milk',
      '1 tbsp peanut butter',
      '1 tbsp cocoa powder',
    ],
  },
  coffeeProteinShake: {
    name: 'Iced coffee protein shake',
    ingredients: ['1 scoop whey (30 g)', '200 ml cold coffee', '200 ml semi-skimmed milk', 'Ice'],
  },
  mangoLassi: {
    name: 'Mango lassi',
    ingredients: [
      '150 g frozen mango',
      '200 g Greek yogurt (2%)',
      '150 ml semi-skimmed milk',
      '1 tsp honey',
    ],
  },
  greenShake: {
    name: 'Green protein shake',
    ingredients: [
      '1 handful spinach',
      '1 banana',
      '1 scoop vanilla whey (30 g)',
      '250 ml oat milk',
    ],
  },
  massGainerShake: {
    name: 'Homemade mass gainer',
    ingredients: [
      '500 ml whole milk',
      '80 g oats',
      '1 scoop whey (30 g)',
      '1 banana',
      '1 tbsp peanut butter',
    ],
  },
  strawberryBananaShake: {
    name: 'Strawberry and banana shake',
    ingredients: [
      '150 g strawberries',
      '1 banana',
      '300 ml semi-skimmed milk',
      '1 scoop whey (30 g)',
    ],
  },
  caseinNightShake: {
    name: 'Casein night shake',
    ingredients: ['1 scoop casein (30 g)', '300 ml semi-skimmed milk', '1 tbsp peanut butter'],
  },
  tropicalShake: {
    name: 'Tropical shake',
    ingredients: [
      '150 g pineapple',
      '100 g mango',
      '200 g Greek yogurt (2%)',
      '150 ml coconut water',
    ],
  },
  cherryChocolateShake: {
    name: 'Cherry chocolate shake',
    ingredients: [
      '150 g frozen cherries',
      '1 scoop chocolate whey (30 g)',
      '300 ml semi-skimmed milk',
      '1 tbsp cocoa powder',
    ],
  },
  appleCinnamonShake: {
    name: 'Apple and cinnamon shake',
    ingredients: [
      '1 apple',
      '40 g oats',
      '1 scoop vanilla whey (30 g)',
      '300 ml semi-skimmed milk',
      'Cinnamon',
    ],
  },
  bananaDateShake: {
    name: 'Banana and date shake',
    ingredients: ['1 banana', '3 dates', '400 ml whole milk', '1 tbsp almond butter'],
  },
  blueberryOatShake: {
    name: 'Blueberry, oat and skyr shake',
    ingredients: ['150 g blueberries', '40 g oats', '200 g skyr', '200 ml semi-skimmed milk'],
  },
  kefirBerryShake: {
    name: 'Kefir and berry shake',
    ingredients: ['300 ml kefir', '100 g berries', '1 scoop whey (30 g)', '1 tsp honey'],
  },
  avocadoChocolateShake: {
    name: 'Avocado chocolate shake',
    ingredients: [
      '½ avocado',
      '1 banana',
      '1 scoop chocolate whey (30 g)',
      '1 tbsp cocoa powder',
      '250 ml unsweetened almond milk',
    ],
  },
  veganProteinShake: {
    name: 'Vegan protein shake',
    ingredients: [
      '300 ml soy milk',
      '1 scoop plant protein (30 g)',
      '1 banana',
      '1 tbsp peanut butter',
    ],
  },
  peachYogurtShake: {
    name: 'Peach and yogurt shake',
    ingredients: ['1 peach', '200 g Greek yogurt (2%)', '150 ml semi-skimmed milk', '20 g oats'],
  },
  orangeCreamShake: {
    name: 'Orange cream shake',
    ingredients: [
      '1 orange',
      '150 g Greek yogurt (2%)',
      '1 scoop vanilla whey (30 g)',
      '200 ml semi-skimmed milk',
    ],
  },
} satisfies Record<MealIdeaId, MealIdeaCopy>;
