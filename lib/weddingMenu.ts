// The banquet menu Golden Unicorn is serving at the reception, with the
// common allergy and dietary triggers marked for each course. Kept here as
// plain data so the FAQ page and any future menu card stay in sync.

export type DietaryTag =
  | 'Pork'
  | 'Shellfish'
  | 'Fish'
  | 'Tree nuts'
  | 'Egg'
  | 'Dairy'
  | 'Wheat'
  | 'Soy'
  | 'Sesame'

// Every tag we use, with the plain language note shown in the legend.
export const DIETARY_TAGS: Record<DietaryTag, string> = {
  Pork: 'Contains pork. These courses are not halal or kosher.',
  Shellfish: 'Contains shellfish such as shrimp, lobster, clam, conch, abalone, or oyster sauce.',
  Fish: 'Contains fish or fish sauce.',
  'Tree nuts': 'Contains tree nuts, or is finished in a kitchen that uses them.',
  Egg: 'Contains egg.',
  Dairy: 'Contains milk, butter, or cream.',
  Wheat: 'Contains wheat, so it is not gluten free. Most sauces here are thickened or soy based.',
  Soy: 'Contains soy, usually from soy sauce or oyster sauce.',
  Sesame: 'Contains sesame.',
}

export type MenuCourse = {
  name: string
  description: string
  tags: DietaryTag[]
  // True when the kitchen varies the ingredients and we would rather a guest
  // ask us than trust the tags alone.
  askUs?: boolean
}

export const MENU_COURSES: MenuCourse[] = [
  {
    name: 'Whole Roasted Suckling Pig',
    description:
      'Served as two courses. The crisp skin comes out first, then the meat.',
    tags: ['Pork', 'Soy'],
  },
  {
    name: 'Conch and Clam with Seafood Rolls',
    description:
      'Conch and clam with a fried seafood roll on the side.',
    tags: ['Shellfish', 'Fish', 'Egg', 'Wheat', 'Soy'],
  },
  {
    name: 'Jumbo Shrimp with Walnut and Mayonnaise',
    description:
      'Lightly battered shrimp in a creamy sauce with candied walnuts.',
    tags: ['Shellfish', 'Tree nuts', 'Egg', 'Dairy', 'Wheat'],
  },
  {
    name: 'House Special Double Steamed Soup',
    description:
      'A slow steamed broth. The kitchen builds it on meat and dried seafood, and the exact ingredients change with the season.',
    tags: ['Pork', 'Shellfish'],
    askUs: true,
  },
  {
    name: 'Whole Abalone and Sea Cucumber with Vegetable',
    description:
      'Abalone and sea cucumber braised with greens in an oyster sauce.',
    tags: ['Shellfish', 'Soy', 'Wheat'],
  },
  {
    name: 'Twin Lobsters Cantonese Style',
    description:
      'Two lobsters in the Cantonese style, which is finished with egg and a little ground pork.',
    tags: ['Shellfish', 'Egg', 'Pork', 'Soy', 'Wheat'],
  },
  {
    name: 'Crispy Fried Chicken with Garlic Sauce',
    description:
      'Fried chicken with a garlic dipping sauce.',
    tags: ['Wheat', 'Soy'],
  },
  {
    name: 'Steamed Live Fishes',
    description:
      'Whole fish steamed with ginger, scallion, and soy. Served on the bone.',
    tags: ['Fish', 'Soy', 'Wheat'],
  },
  {
    name: 'House Special Fried Rice and E-Fu Noodle',
    description:
      'Both come to the table. The fried rice is made with egg, shrimp, and pork, and E-Fu is a wheat and egg noodle.',
    tags: ['Egg', 'Shellfish', 'Pork', 'Wheat', 'Soy'],
  },
  {
    name: 'Piggy Buns with Egg Custard',
    description:
      'Our first dessert, in place of the red bean soup and cookies on the house menu. Little buns shaped like piglets, filled with egg custard.',
    tags: ['Egg', 'Dairy', 'Wheat', 'Soy'],
  },
  {
    name: 'Wedding Cake in Black Sesame and Vanilla',
    description:
      'Our second dessert, in place of the fruit platter on the house menu. Two layers, one black sesame and one vanilla. The cake is nut free, and it is made with no nut cross contact.',
    tags: ['Sesame', 'Egg', 'Dairy', 'Wheat'],
  },
]
