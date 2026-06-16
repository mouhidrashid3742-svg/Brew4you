# ⚡ QUICK REFERENCE - CHANGE PRICES & ADD ITEMS

## 🎯 THE SIMPLEST VERSION

### CHANGE A PRICE IN 3 STEPS

**Step 1:** Open this file
```
c:\Users\mouhi\Desktop\Brew4You\data\menu.ts
```

**Step 2:** Find what you want to change
```
Ctrl+F → Type item name → Find
```

**Step 3:** Change the number
```javascript
// BEFORE:
price: 280

// AFTER:
price: 350
```

**Step 4:** Save
```
Ctrl+S
```

**Done!** Website updates automatically. ✅

---

### ADD A NEW ITEM IN 5 STEPS

**Step 1:** Open `data/menu.ts`

**Step 2:** Go to END of file (find the `]`)

**Step 3:** Add comma after last item:
```javascript
// Last item ends with:
}  ← No comma

// Add comma:
},  ← Now has comma
```

**Step 4:** Copy & paste this template:
```javascript
{
  id: "my-drink",
  name: "My Drink Name",
  category: "Hot Coffee",
  price: 450,
  description: "A brief description here.",
  popular: false,
  intensity: 3,
  image: "https://images.unsplash.com/photo-..."
}
```

**Step 5:** Edit the template with YOUR values
- `id`: lowercase, no spaces (e.g., "cold-brew")
- `name`: What customers see (e.g., "Cold Brew")
- `category`: One of: Hot Coffee, Cold Coffee, Frappes, Non Coffee
- `price`: Just number (e.g., 350)
- `description`: Brief text (under 100 characters)
- `popular`: true or false
- `intensity`: 1-5 (1=weak, 5=strong)
- `image`: URL from unsplash.com

**Done!** New item shows on menu. ✅

---

## 📋 CATEGORIES (MUST BE EXACT)

```
"Hot Coffee"     - Espresso, Americano, Cappuccino, etc.
"Cold Coffee"    - Iced Latte, Iced Americano, etc.
"Frappes"        - Caramel Frappe, Vanilla Frappe, etc.
"Non Coffee"     - Matcha, Hot Chocolate, Tea, etc.
```

---

## ⚡ INTENSITY LEVELS (1-5)

```
1 ★        Tea, Hot Chocolate (low caffeine)
2 ★★       Frappe, Light drinks
3 ★★★      Cappuccino, Matcha (medium)
4 ★★★★     Americano, Iced Coffee (strong)
5 ★★★★★    Espresso (very strong)
```

---

## 🖼️ WHERE TO GET FREE IMAGES

1. Go to: https://unsplash.com
2. Search: "coffee" or your drink
3. Right-click image
4. Copy image address
5. Paste in `image:` field

---

## ⚠️ COMMON MISTAKES

| Problem | Wrong | Right |
|---------|-------|-------|
| Price with text | `price: "PKR 280"` | `price: 280` |
| Missing comma | `},` | `},` (after each item) |
| Wrong category | `"hot coffee"` | `"Hot Coffee"` |
| Quote marks | `name: Espresso` | `name: "Espresso"` |

---

## 📱 MOBILE TEST

After making changes:
1. Open: http://localhost:3000/menu
2. Check: Prices correct?
3. Check: New items appear?
4. Check: Mobile looks good?

---

## 🆘 IF BROKEN

**Website shows error:**
1. Check for missing commas `,`
2. Check for missing quotes `""`
3. Undo the change
4. Ask me for help

**New item missing:**
1. Hard refresh: `Ctrl+Shift+R`
2. Check spelling of category
3. Check if item is in right section

---

## 📞 FILE LOCATIONS

```
Menu Items (Products):
  c:\Users\mouhi\Desktop\Brew4You\data\menu.ts

Blog Articles:
  c:\Users\mouhi\Desktop\Brew4You\data\blogs.ts

Website Running At:
  http://localhost:3000/menu
```

---

## 🎉 THAT'S IT!

You now know how to:
- ✅ Change prices
- ✅ Add new items
- ✅ Update descriptions
- ✅ Mark as popular
- ✅ Change images

**Start editing! Questions? Ask me!**

---

## 📖 MORE HELP

For detailed guides, read:
- `HOW_TO_EDIT.md` - Complete editing guide
- `EXAMPLES.ts` - Code examples
- `CONTENT_MANAGEMENT.md` - Where everything is
- `SETUP_GUIDE.md` - Setup instructions

---

## 🚀 NEXT STEPS

1. **Today:** Practice changing a price
2. **Tomorrow:** Add a new item
3. **Next:** Edit descriptions
4. **Later:** Set up admin dashboard for easy management

**You've got this! 💪**
