export interface MenuItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  description: string;
  popular: boolean;
  intensity: number;
  image: string;
  available: boolean;
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    caffeine: number; // in mg
  };
  allergens: string[];
  customizations: {
    milkOptions: { name: string; priceAdd: number }[];
    sizeOptions: { name: string; priceAdd: number }[];
    extraShots: { name: string; priceAdd: number }[];
    syrups: { name: string; priceAdd: number }[];
    toppings: { name: string; priceAdd: number }[];
  };
}

export const enhancedMenuItems: MenuItem[] = [
  // Signature Drinks
  {
    id: "golden-spanish-latte",
    name: "Golden Spanish Latte",
    category: "Signature Drinks",
    basePrice: 520,
    description: "Our signature masterpiece. Smooth espresso layered with silky milk and sweet condensed milk for a rich, creamy experience that keeps customers coming back.",
    popular: true,
    intensity: 4,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 320,
      protein: 12,
      carbs: 38,
      fat: 12,
      caffeine: 75
    },
    allergens: ["dairy"],
    customizations: {
      milkOptions: [
        { name: "Regular Milk", priceAdd: 0 },
        { name: "Oat Milk", priceAdd: 30 },
        { name: "Almond Milk", priceAdd: 30 },
        { name: "Coconut Milk", priceAdd: 40 }
      ],
      sizeOptions: [
        { name: "Regular (250ml)", priceAdd: 0 },
        { name: "Large (350ml)", priceAdd: 80 }
      ],
      extraShots: [
        { name: "No Extra", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 },
        { name: "+2 Shots", priceAdd: 80 }
      ],
      syrups: [
        { name: "No Syrup", priceAdd: 0 },
        { name: "Vanilla", priceAdd: 20 },
        { name: "Caramel", priceAdd: 20 },
        { name: "Hazelnut", priceAdd: 25 }
      ],
      toppings: [
        { name: "None", priceAdd: 0 },
        { name: "Whipped Cream", priceAdd: 30 },
        { name: "Chocolate Drizzle", priceAdd: 20 }
      ]
    }
  },
  {
    id: "signature-caramel-frappe",
    name: "Signature Caramel Frappe",
    category: "Signature Drinks",
    basePrice: 540,
    description: "A luxurious blend of espresso, creamy vanilla ice cream, and rich caramel finished with an irresistible smooth texture. Dessert and coffee in one cup.",
    popular: true,
    intensity: 2,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 420,
      protein: 10,
      carbs: 55,
      fat: 16,
      caffeine: 60
    },
    allergens: ["dairy"],
    customizations: {
      milkOptions: [
        { name: "Dairy", priceAdd: 0 },
        { name: "Oat Milk", priceAdd: 30 },
        { name: "Almond Milk", priceAdd: 30 }
      ],
      sizeOptions: [
        { name: "Regular (350ml)", priceAdd: 0 },
        { name: "Large (450ml)", priceAdd: 100 }
      ],
      extraShots: [
        { name: "None", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 }
      ],
      syrups: [
        { name: "Standard Caramel", priceAdd: 0 },
        { name: "Extra Caramel", priceAdd: 20 }
      ],
      toppings: [
        { name: "None", priceAdd: 0 },
        { name: "Whipped Cream", priceAdd: 40 },
        { name: "Caramel Drizzle Extra", priceAdd: 25 }
      ]
    }
  },
  {
    id: "luxury-mocha",
    name: "Luxury Mocha",
    category: "Signature Drinks",
    basePrice: 480,
    description: "Deep chocolate meets premium espresso in a perfectly balanced drink crafted for chocolate lovers who appreciate true coffee flavor.",
    popular: true,
    intensity: 4,
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 380,
      protein: 11,
      carbs: 42,
      fat: 14,
      caffeine: 80
    },
    allergens: ["dairy", "nuts"],
    customizations: {
      milkOptions: [
        { name: "Whole Milk", priceAdd: 0 },
        { name: "Oat Milk", priceAdd: 30 },
        { name: "Almond Milk", priceAdd: 30 },
        { name: "2% Milk", priceAdd: 0 }
      ],
      sizeOptions: [
        { name: "Regular (300ml)", priceAdd: 0 },
        { name: "Large (400ml)", priceAdd: 80 }
      ],
      extraShots: [
        { name: "Standard", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 }
      ],
      syrups: [
        { name: "No Syrup", priceAdd: 0 },
        { name: "Hazelnut", priceAdd: 25 }
      ],
      toppings: [
        { name: "None", priceAdd: 0 },
        { name: "Whipped Cream", priceAdd: 30 },
        { name: "Chocolate Dust", priceAdd: 15 }
      ]
    }
  },

  // Hot Coffee
  {
    id: "espresso",
    name: "Espresso",
    category: "Hot Coffee",
    basePrice: 280,
    description: "A bold and concentrated shot with rich chocolate notes and a velvety finish.",
    popular: true,
    intensity: 5,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 5,
      protein: 0.1,
      carbs: 0,
      fat: 0,
      caffeine: 75
    },
    allergens: [],
    customizations: {
      milkOptions: [],
      sizeOptions: [
        { name: "Single (30ml)", priceAdd: 0 },
        { name: "Double (60ml)", priceAdd: 60 }
      ],
      extraShots: [],
      syrups: [],
      toppings: []
    }
  },
  {
    id: "americano",
    name: "Americano",
    category: "Hot Coffee",
    basePrice: 320,
    description: "Smooth espresso diluted with hot water for a clean, balanced coffee experience with a full-bodied finish.",
    popular: true,
    intensity: 4,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 10,
      protein: 0.5,
      carbs: 0,
      fat: 0,
      caffeine: 75
    },
    allergens: [],
    customizations: {
      milkOptions: [
        { name: "Black", priceAdd: 0 },
        { name: "Add Milk", priceAdd: 30 }
      ],
      sizeOptions: [
        { name: "Regular (300ml)", priceAdd: 0 },
        { name: "Large (400ml)", priceAdd: 60 }
      ],
      extraShots: [
        { name: "None", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 }
      ],
      syrups: [
        { name: "None", priceAdd: 0 },
        { name: "Any Syrup", priceAdd: 20 }
      ],
      toppings: []
    }
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    category: "Hot Coffee",
    basePrice: 380,
    description: "Perfect harmony of espresso, steamed milk, and silky foam for a timeless café classic.",
    popular: true,
    intensity: 4,
    image: "https://images.unsplash.com/photo-1534351590666-409d8f6757a0?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 150,
      protein: 9,
      carbs: 12,
      fat: 6,
      caffeine: 75
    },
    allergens: ["dairy"],
    customizations: {
      milkOptions: [
        { name: "Whole Milk", priceAdd: 0 },
        { name: "Oat Milk", priceAdd: 30 },
        { name: "Almond Milk", priceAdd: 30 },
        { name: "Coconut Milk", priceAdd: 40 }
      ],
      sizeOptions: [
        { name: "Regular (300ml)", priceAdd: 0 },
        { name: "Large (400ml)", priceAdd: 80 }
      ],
      extraShots: [
        { name: "None", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 }
      ],
      syrups: [
        { name: "None", priceAdd: 0 },
        { name: "Vanilla", priceAdd: 20 },
        { name: "Caramel", priceAdd: 20 }
      ],
      toppings: [
        { name: "None", priceAdd: 0 },
        { name: "Cocoa Dust", priceAdd: 15 }
      ]
    }
  },
  {
    id: "latte",
    name: "Latte",
    category: "Hot Coffee",
    basePrice: 390,
    description: "Smooth espresso blended with creamy milk to create a comforting and perfectly balanced cup.",
    popular: false,
    intensity: 3,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 190,
      protein: 10,
      carbs: 16,
      fat: 8,
      caffeine: 75
    },
    allergens: ["dairy"],
    customizations: {
      milkOptions: [
        { name: "Whole Milk", priceAdd: 0 },
        { name: "Oat Milk", priceAdd: 30 },
        { name: "Almond Milk", priceAdd: 30 },
        { name: "Coconut Milk", priceAdd: 40 }
      ],
      sizeOptions: [
        { name: "Regular (350ml)", priceAdd: 0 },
        { name: "Large (450ml)", priceAdd: 80 }
      ],
      extraShots: [
        { name: "None", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 },
        { name: "+2 Shots", priceAdd: 80 }
      ],
      syrups: [
        { name: "None", priceAdd: 0 },
        { name: "Vanilla", priceAdd: 20 },
        { name: "Caramel", priceAdd: 20 },
        { name: "Hazelnut", priceAdd: 25 }
      ],
      toppings: [
        { name: "None", priceAdd: 0 },
        { name: "Whipped Cream", priceAdd: 30 }
      ]
    }
  },
  {
    id: "mocha",
    name: "Mocha",
    category: "Hot Coffee",
    basePrice: 420,
    description: "Premium espresso combined with rich chocolate for a sweet and indulgent coffee experience.",
    popular: false,
    intensity: 3,
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 240,
      protein: 10,
      carbs: 28,
      fat: 10,
      caffeine: 75
    },
    allergens: ["dairy"],
    customizations: {
      milkOptions: [
        { name: "Whole Milk", priceAdd: 0 },
        { name: "Oat Milk", priceAdd: 30 },
        { name: "Almond Milk", priceAdd: 30 }
      ],
      sizeOptions: [
        { name: "Regular (350ml)", priceAdd: 0 },
        { name: "Large (450ml)", priceAdd: 80 }
      ],
      extraShots: [
        { name: "None", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 }
      ],
      syrups: [],
      toppings: [
        { name: "None", priceAdd: 0 },
        { name: "Whipped Cream", priceAdd: 30 },
        { name: "Chocolate Drizzle", priceAdd: 20 }
      ]
    }
  },

  // Cold Coffee
  {
    id: "iced-americano",
    name: "Iced Americano",
    category: "Cold Coffee",
    basePrice: 360,
    description: "Refreshing and bold, delivering pure coffee flavor over ice with a clean finish.",
    popular: true,
    intensity: 4,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 15,
      protein: 0.5,
      carbs: 0,
      fat: 0,
      caffeine: 75
    },
    allergens: [],
    customizations: {
      milkOptions: [
        { name: "Black", priceAdd: 0 },
        { name: "Add Milk", priceAdd: 30 }
      ],
      sizeOptions: [
        { name: "Regular (350ml)", priceAdd: 0 },
        { name: "Large (450ml)", priceAdd: 60 }
      ],
      extraShots: [
        { name: "None", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 }
      ],
      syrups: [
        { name: "None", priceAdd: 0 },
        { name: "Any Syrup", priceAdd: 20 }
      ],
      toppings: []
    }
  },
  {
    id: "iced-latte",
    name: "Iced Latte",
    category: "Cold Coffee",
    basePrice: 410,
    description: "Smooth espresso and chilled milk combined for a refreshing and creamy coffee experience.",
    popular: true,
    intensity: 3,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 170,
      protein: 9,
      carbs: 14,
      fat: 7,
      caffeine: 75
    },
    allergens: ["dairy"],
    customizations: {
      milkOptions: [
        { name: "Whole Milk", priceAdd: 0 },
        { name: "Oat Milk", priceAdd: 30 },
        { name: "Almond Milk", priceAdd: 30 },
        { name: "Coconut Milk", priceAdd: 40 }
      ],
      sizeOptions: [
        { name: "Regular (350ml)", priceAdd: 0 },
        { name: "Large (450ml)", priceAdd: 60 }
      ],
      extraShots: [
        { name: "None", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 }
      ],
      syrups: [
        { name: "None", priceAdd: 0 },
        { name: "Vanilla", priceAdd: 20 },
        { name: "Caramel", priceAdd: 20 }
      ],
      toppings: []
    }
  },
  {
    id: "spanish-latte-cold",
    name: "Spanish Latte (Cold)",
    category: "Cold Coffee",
    basePrice: 450,
    description: "A customer favorite featuring espresso, milk, and condensed milk for an extra creamy and luxurious taste.",
    popular: true,
    intensity: 4,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 310,
      protein: 11,
      carbs: 36,
      fat: 11,
      caffeine: 75
    },
    allergens: ["dairy"],
    customizations: {
      milkOptions: [
        { name: "Regular Milk", priceAdd: 0 },
        { name: "Oat Milk", priceAdd: 30 },
        { name: "Almond Milk", priceAdd: 30 }
      ],
      sizeOptions: [
        { name: "Regular (350ml)", priceAdd: 0 },
        { name: "Large (450ml)", priceAdd: 80 }
      ],
      extraShots: [
        { name: "None", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 }
      ],
      syrups: [],
      toppings: []
    }
  },
  {
    id: "iced-hazelnut-latte",
    name: "Iced Hazelnut Latte",
    category: "Cold Coffee",
    basePrice: 440,
    description: "A refreshing blend of espresso, chilled milk, and roasted hazelnut notes for a smooth and irresistibly nutty experience.",
    popular: false,
    intensity: 3,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 210,
      protein: 9,
      carbs: 24,
      fat: 9,
      caffeine: 75
    },
    allergens: ["dairy", "nuts"],
    customizations: {
      milkOptions: [
        { name: "Whole Milk", priceAdd: 0 },
        { name: "Oat Milk", priceAdd: 30 },
        { name: "Almond Milk", priceAdd: 30 }
      ],
      sizeOptions: [
        { name: "Regular (350ml)", priceAdd: 0 },
        { name: "Large (450ml)", priceAdd: 60 }
      ],
      extraShots: [
        { name: "None", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 }
      ],
      syrups: [],
      toppings: []
    }
  },

  // Frappes
  {
    id: "caramel-frappe",
    name: "Caramel Frappe",
    category: "Frappes",
    basePrice: 470,
    description: "A creamy frozen coffee blended with rich caramel flavors and crafted for ultimate refreshment.",
    popular: true,
    intensity: 2,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 380,
      protein: 10,
      carbs: 52,
      fat: 12,
      caffeine: 50
    },
    allergens: ["dairy"],
    customizations: {
      milkOptions: [
        { name: "Dairy", priceAdd: 0 },
        { name: "Oat Milk", priceAdd: 30 },
        { name: "Almond Milk", priceAdd: 30 }
      ],
      sizeOptions: [
        { name: "Regular (350ml)", priceAdd: 0 },
        { name: "Large (450ml)", priceAdd: 80 }
      ],
      extraShots: [
        { name: "None", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 }
      ],
      syrups: [],
      toppings: [
        { name: "None", priceAdd: 0 },
        { name: "Whipped Cream", priceAdd: 40 },
        { name: "Caramel Drizzle", priceAdd: 20 }
      ]
    }
  },
  {
    id: "mocha-frappe",
    name: "Mocha Frappe",
    category: "Frappes",
    basePrice: 490,
    description: "A smooth chocolate-coffee blend with a rich and satisfying finish.",
    popular: false,
    intensity: 2,
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 360,
      protein: 10,
      carbs: 48,
      fat: 12,
      caffeine: 50
    },
    allergens: ["dairy"],
    customizations: {
      milkOptions: [
        { name: "Dairy", priceAdd: 0 },
        { name: "Oat Milk", priceAdd: 30 },
        { name: "Almond Milk", priceAdd: 30 }
      ],
      sizeOptions: [
        { name: "Regular (350ml)", priceAdd: 0 },
        { name: "Large (450ml)", priceAdd: 80 }
      ],
      extraShots: [
        { name: "None", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 }
      ],
      syrups: [],
      toppings: [
        { name: "None", priceAdd: 0 },
        { name: "Whipped Cream", priceAdd: 40 },
        { name: "Chocolate Drizzle", priceAdd: 20 }
      ]
    }
  },
  {
    id: "hazelnut-frappe",
    name: "Hazelnut Frappe",
    category: "Frappes",
    basePrice: 500,
    description: "Creamy espresso infused with roasted hazelnut flavor for a nutty and luxurious experience.",
    popular: false,
    intensity: 2,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 370,
      protein: 10,
      carbs: 48,
      fat: 14,
      caffeine: 50
    },
    allergens: ["dairy", "nuts"],
    customizations: {
      milkOptions: [
        { name: "Dairy", priceAdd: 0 },
        { name: "Oat Milk", priceAdd: 30 },
        { name: "Almond Milk", priceAdd: 30 }
      ],
      sizeOptions: [
        { name: "Regular (350ml)", priceAdd: 0 },
        { name: "Large (450ml)", priceAdd: 80 }
      ],
      extraShots: [
        { name: "None", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 }
      ],
      syrups: [],
      toppings: [
        { name: "None", priceAdd: 0 },
        { name: "Whipped Cream", priceAdd: 40 }
      ]
    }
  },
  {
    id: "vanilla-frappe",
    name: "Vanilla Frappe",
    category: "Frappes",
    basePrice: 460,
    description: "A smooth and refreshing blend with delicate vanilla notes and a creamy finish.",
    popular: false,
    intensity: 2,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 340,
      protein: 10,
      carbs: 46,
      fat: 11,
      caffeine: 50
    },
    allergens: ["dairy"],
    customizations: {
      milkOptions: [
        { name: "Dairy", priceAdd: 0 },
        { name: "Oat Milk", priceAdd: 30 },
        { name: "Almond Milk", priceAdd: 30 }
      ],
      sizeOptions: [
        { name: "Regular (350ml)", priceAdd: 0 },
        { name: "Large (450ml)", priceAdd: 80 }
      ],
      extraShots: [
        { name: "None", priceAdd: 0 },
        { name: "+1 Shot", priceAdd: 40 }
      ],
      syrups: [],
      toppings: [
        { name: "None", priceAdd: 0 },
        { name: "Whipped Cream", priceAdd: 40 }
      ]
    }
  },

  // Non-Coffee
  {
    id: "hot-chocolate",
    name: "Hot Chocolate",
    category: "Non Coffee",
    basePrice: 330,
    description: "Rich, velvety, and comforting. Crafted with premium chocolate for a luxurious cocoa experience.",
    popular: false,
    intensity: 0,
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80",
    available: true,
    nutritionalInfo: {
      calories: 280,
      protein: 9,
      carbs: 35,
      fat: 10,
      caffeine: 5
    },
    allergens: ["dairy"],
    customizations: {
      milkOptions: [
        { name: "Whole Milk", priceAdd: 0 },
        { name: "Oat Milk", priceAdd: 30 },
        { name: "Almond Milk", priceAdd: 30 }
      ],
      sizeOptions: [
        { name: "Regular (300ml)", priceAdd: 0 },
        { name: "Large (400ml)", priceAdd: 60 }
      ],
      extraShots: [],
      syrups: [
        { name: "None", priceAdd: 0 },
        { name: "Vanilla", priceAdd: 20 }
      ],
      toppings: [
        { name: "None", priceAdd: 0 },
        { name: "Whipped Cream", priceAdd: 30 },
        { name: "Marshmallows", priceAdd: 25 }
      ]
    }
  }
];

export const addOns = [
  { id: "extra-shot", name: "Extra Espresso Shot", price: 40, category: "Shots" },
  { id: "whipped-cream", name: "Whipped Cream", price: 30, category: "Toppings" },
  { id: "caramel-drizzle", name: "Caramel Drizzle", price: 20, category: "Drizzles" },
  { id: "chocolate-drizzle", name: "Chocolate Drizzle", price: 20, category: "Drizzles" }
];
