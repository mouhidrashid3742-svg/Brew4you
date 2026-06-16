// ============================================
// EXAMPLE: HOW TO EDIT YOUR MENU
// ============================================

// FILE LOCATION: c:\Users\mouhi\Desktop\Brew4You\data\menu.ts

// ============================================
// EXAMPLE 1: CHANGE PRICE
// ============================================

// BEFORE:
{
  id: "espresso",
  name: "Espresso",
  category: "Hot Coffee",
  price: 280,                    ← OLD PRICE
  description: "Rich Italian espresso with a silky crema finish.",
  popular: true,
  intensity: 5,
  image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"
}

// AFTER (Change to PKR 350):
{
  id: "espresso",
  name: "Espresso",
  category: "Hot Coffee",
  price: 350,                    ← NEW PRICE
  description: "Rich Italian espresso with a silky crema finish.",
  popular: true,
  intensity: 5,
  image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"
}

// ============================================
// EXAMPLE 2: CHANGE DESCRIPTION
// ============================================

// BEFORE:
{
  id: "cappuccino",
  name: "Cappuccino",
  category: "Hot Coffee",
  price: 380,
  description: "Velvety milk foam layered over strong espresso.",
  popular: true,
  intensity: 4,
  image: "..."
}

// AFTER (New description):
{
  id: "cappuccino",
  name: "Cappuccino",
  category: "Hot Coffee",
  price: 380,
  description: "Premium cappuccino - 1/3 espresso, 2/3 steamed milk, 1/3 foam",
  popular: true,
  intensity: 4,
  image: "..."
}

// ============================================
// EXAMPLE 3: MARK AS POPULAR
// ============================================

// BEFORE (Regular item):
{
  id: "latte",
  name: "Latte",
  category: "Hot Coffee",
  price: 390,
  description: "Smooth espresso, silky steamed milk, and soft foam.",
  popular: false,              ← NOT POPULAR
  intensity: 3,
  image: "..."
}

// AFTER (Mark as popular):
{
  id: "latte",
  name: "Latte",
  category: "Hot Coffee",
  price: 390,
  description: "Smooth espresso, silky steamed milk, and soft foam.",
  popular: true,               ← NOW POPULAR (shows badge!)
  intensity: 3,
  image: "..."
}

// ============================================
// EXAMPLE 4: ADD COMPLETELY NEW ITEM
// ============================================

// Go to END of file, before the closing ']'
// Add comma to previous item, then paste:

{
  id: "dalgona-coffee",
  name: "Dalgona Coffee",
  category: "Hot Coffee",
  price: 380,
  description: "Whipped coffee foam floating on creamy milk - trendy & delicious!",
  popular: true,
  intensity: 4,
  image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"
}

// ============================================
// EXAMPLE 5: CHANGE MULTIPLE PRICES
// ============================================

// Let's say Espresso: 280→350, Americano: 320→400

// BEFORE:
{ id: "espresso",  price: 280, ... },
{ id: "americano", price: 320, ... },

// AFTER:
{ id: "espresso",  price: 350, ... },
{ id: "americano", price: 400, ... },

// ============================================
// QUICK CATEGORIES REFERENCE
// ============================================

// Valid categories (MUST BE EXACT):
// - "Hot Coffee"
// - "Cold Coffee"
// - "Frappes"
// - "Non Coffee"

// ============================================
// QUICK INTENSITY REFERENCE
// ============================================

intensity: 1,  // Tea, Hot Chocolate (low caffeine)
intensity: 2,  // Frappe, Light Latte
intensity: 3,  // Cappuccino, Matcha (medium)
intensity: 4,  // Americano, Iced Coffee (strong)
intensity: 5,  // Espresso (very strong)

// ============================================
// WORKFLOW: MAKE CHANGE → SAVE → RELOAD
// ============================================

// 1. Open file: data/menu.ts
// 2. Find the item you want to change
// 3. Edit: price, description, name, etc.
// 4. Save: Ctrl+S
// 5. Reload browser: F5 or Ctrl+R
// 6. Done! Changes appear immediately

// ============================================
// IMPORTANT REMINDERS
// ============================================

// ✅ DO THIS:
- price: 350           // Just the number
- "Espresso"           // Quoted text
- category: "Hot Coffee"  // Exact spelling
- popular: true        // true or false (lowercase)

// ❌ DON'T DO THIS:
- price: "PKR 350"     // Don't add PKR
- name: Espresso       // Must be quoted
- category: "hot coffee"  // Must match case
- popular: "true"      // Must be lowercase, no quotes

// ============================================
// COMMON MISTAKES & FIXES
// ============================================

// MISTAKE 1: Missing comma
{
  id: "espresso",
  name: "Espresso"
} {
  id: "americano",  // ❌ ERROR: Missing comma before {
  name: "Americano"
}

// FIX:
{
  id: "espresso",
  name: "Espresso"
}, {  // ✅ Add comma
  id: "americano",
  name: "Americano"
}

// MISTAKE 2: Wrong category spelling
category: "hot coffee"  // ❌ lowercase
category: "Hot Coffees" // ❌ extra s

// FIX:
category: "Hot Coffee"  // ✅ exact spelling

// MISTAKE 3: Price with text
price: "PKR 350"        // ❌ This breaks

// FIX:
price: 350              // ✅ Just the number

// ============================================
// YOU'RE READY! GO EDIT YOUR MENU!
// ============================================
