# HOW TO CHANGE PRICES & ADD NEW ITEMS

## 📍 WHERE YOUR MENU IS STORED

**File:** `c:\Users\mouhi\Desktop\Brew4You\data\menu.ts`

This file contains all your products (coffee, drinks, etc.)

---

## ✏️ METHOD 1: EDIT DIRECTLY (Easiest Right Now)

### STEP 1: Open the Menu File

1. Go to: `c:\Users\mouhi\Desktop\Brew4You\data`
2. Open file: `menu.ts`
3. Use VS Code or any text editor

---

### STEP 2: CHANGE PRICES

**Example:** Change Espresso from PKR 280 to PKR 350

**Find this:**
```javascript
{
  id: "espresso",
  name: "Espresso",
  category: "Hot Coffee",
  price: 280,  ← CHANGE THIS
  description: "Rich Italian espresso with a silky crema finish.",
  popular: true,
  intensity: 5,
  image: "..."
}
```

**Change to:**
```javascript
{
  id: "espresso",
  name: "Espresso",
  category: "Hot Coffee",
  price: 350,  ← NEW PRICE
  description: "Rich Italian espresso with a silky crema finish.",
  popular: true,
  intensity: 5,
  image: "..."
}
```

**Then:**
1. Save file (Ctrl+S)
2. Website automatically updates ✅

---

### STEP 3: CHANGE DESCRIPTION

**Find this:**
```javascript
description: "Rich Italian espresso with a silky crema finish.",
```

**Change to:**
```javascript
description: "Premium Italian espresso - Bold & Rich flavor",
```

**Save and done!** ✅

---

### STEP 4: CHANGE POPULARITY (Mark as Popular)

**Current:**
```javascript
popular: false,  ← Shows as regular item
```

**To mark as Popular (shows badge):**
```javascript
popular: true,   ← Shows "Popular" badge
```

---

## ➕ METHOD 2: ADD A NEW ITEM

### Complete Template (Copy & Paste)

**Step 1:** Open `data/menu.ts`

**Step 2:** Go to the END of the file (before the closing bracket `]`)

**Step 3:** Add a comma after the last item, then paste this:

```javascript
{
  id: "your-drink-id",
  name: "Your Drink Name",
  category: "Hot Coffee",  // or Cold Coffee, Frappes, Non Coffee
  price: 450,
  description: "Brief description of your drink.",
  popular: true,  // or false
  intensity: 4,   // 1-5 (caffeine level)
  image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"
}
```

### Example: Adding Dalgona Coffee

**Add this to the end of Hot Coffee section:**

```javascript
{
  id: "dalgona-coffee",
  name: "Dalgona Coffee",
  category: "Hot Coffee",
  price: 380,
  description: "Whipped coffee foam floating on creamy milk.",
  popular: false,
  intensity: 4,
  image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"
}
```

---

## 📋 IMPORTANT FIELDS EXPLAINED

### 1. **id** (Must be unique)
- Use lowercase, no spaces
- Examples: `"dalgona-coffee"`, `"cold-brew"`, `"irish-coffee"`
- Used internally, customers don't see it

### 2. **name** (What customers see)
- Can have spaces and capital letters
- Examples: `"Dalgona Coffee"`, `"Iced Latte"`, `"Irish Coffee"`

### 3. **category** (Must match exactly)
Allowed values:
- `"Hot Coffee"`
- `"Cold Coffee"`
- `"Frappes"`
- `"Non Coffee"`

### 4. **price** (In PKR)
- Just the number (no currency symbol)
- Examples: `280`, `450`, `500`

### 5. **description** (Shows on menu)
- Keep under 100 characters
- Be descriptive but concise
- Examples:
  - `"Rich Italian espresso with a silky crema finish."`
  - `"Whipped coffee foam on creamy milk"`

### 6. **popular** (true or false)
- `true` = Shows "Popular" badge ⭐
- `false` = Regular item
- Shows on featured section too

### 7. **intensity** (Caffeine level 1-5)
- `1` = Low caffeine (Tea, Hot Chocolate)
- `2` = Light (Frappe, Latte)
- `3` = Medium (Cappuccino)
- `4` = Strong (Americano, Iced Latte)
- `5` = Extra Strong (Espresso)
- Shows as gold stars ⭐⭐⭐⭐⭐

### 8. **image** (Product photo URL)
- Use any free image from:
  - Unsplash: `https://unsplash.com`
  - Pexels: `https://pexels.com`
  - Pixabay: `https://pixabay.com`

---

## 🔄 WORKFLOW: Change → Save → See Result

### Scenario 1: Change Espresso Price

1. **Open:** `data/menu.ts`
2. **Find:** `id: "espresso"` section
3. **Change:** `price: 280` → `price: 350`
4. **Save:** Ctrl+S
5. **Reload:** Browser automatically updates
6. **Done!** ✅

### Scenario 2: Add Cold Brew Coffee

1. **Open:** `data/menu.ts`
2. **Go to:** End of file (before final `]`)
3. **Paste:** New item template (see above)
4. **Fill in:** All fields
5. **Save:** Ctrl+S
6. **Reload:** Website shows new item
7. **Done!** ✅

---

## ⚠️ IMPORTANT NOTES

### DO's ✅
- Always use commas between items
- Keep prices as numbers (not "PKR 280")
- Use valid categories only
- Keep descriptions brief
- Save after each change

### DON'Ts ❌
- Don't remove the commas
- Don't use special characters in names
- Don't create new categories (use existing ones)
- Don't add extra fields (stick to the template)
- Don't delete the closing bracket `]`

---

## 📊 CATEGORIES QUICK REFERENCE

### Hot Coffee
- Espresso
- Americano
- Cappuccino
- Latte
- Mocha
- **[YOUR NEW ITEMS HERE]**

### Cold Coffee
- Iced Latte
- Iced Americano
- Spanish Latte
- **[YOUR NEW ITEMS HERE]**

### Frappes
- Caramel Frappe
- Mocha Frappe
- Hazelnut Frappe
- Vanilla Frappe
- **[YOUR NEW ITEMS HERE]**

### Non Coffee
- Matcha
- Hot Chocolate
- Tea
- **[YOUR NEW ITEMS HERE]**

---

## 🖼️ WHERE TO GET FREE IMAGES

### Easy: Use Current Images
```
"https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"
```

### Better: Get Custom Images

1. Go to: https://unsplash.com
2. Search: "coffee" or "matcha" or "chocolate"
3. Right-click image → Copy image address
4. Paste in `image:` field

**Examples:**
- Espresso: Search "espresso coffee"
- Cold Coffee: Search "iced coffee"
- Frappe: Search "coffee frappe"
- Matcha: Search "matcha latte"

---

## 💡 EXAMPLE: COMPLETE NEW PRODUCT

Let's say you want to add "Irish Coffee" (Whiskey + Coffee):

```javascript
{
  id: "irish-coffee",
  name: "Irish Coffee",
  category: "Hot Coffee",
  price: 480,
  description: "Warm coffee with Irish whiskey and cream topping.",
  popular: true,
  intensity: 4,
  image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"
}
```

**Breakdown:**
- `id: "irish-coffee"` - Internal ID
- `name: "Irish Coffee"` - What shows on menu
- `category: "Hot Coffee"` - Appears in Hot Coffee section
- `price: 480` - PKR 480
- `description: "..."` - Shows on card
- `popular: true` - Shows Popular badge
- `intensity: 4` - 4 stars (strong caffeine)
- `image: "..."` - Product photo

---

## 🚀 FUTURE: ADMIN DASHBOARD (Coming Soon)

### For Later (When You Have Database):
- No need to edit files
- Click in browser to add/edit items
- See live updates instantly
- Upload images easily
- Better for non-technical use

### Current Admin Area (Not fully functional yet):
- URL: `http://localhost:3000/admin/login`
- Password: What you set in `.env.local`
- We can activate this after you set up MongoDB

---

## 📱 QUICK REFERENCE CARD

| What to Change | File | How | Example |
|---|---|---|---|
| Price | `menu.ts` | Find price field | `price: 350` |
| Description | `menu.ts` | Find description | `description: "..."` |
| Name | `menu.ts` | Find name field | `name: "New Name"` |
| Mark Popular | `menu.ts` | Change popular | `popular: true` |
| Add New Item | `menu.ts` | Paste template | See above |
| Caffeine Level | `menu.ts` | Change intensity | `intensity: 5` |
| Product Photo | `menu.ts` | Change image URL | `image: "..."` |

---

## ✅ CHECKLIST FOR ADDING A NEW ITEM

```
□ Item has unique id (no spaces, lowercase)
□ Item has display name
□ Category is valid (Hot Coffee, Cold Coffee, Frappes, Non Coffee)
□ Price is a number (no PKR symbol)
□ Description is under 100 characters
□ Intensity is 1-5
□ Image URL is valid
□ Comma added before new item
□ File saved
□ Website reloaded
□ New item appears on menu ✅
```

---

## 🆘 COMMON PROBLEMS & FIXES

### Problem: "Website shows error after saving"
**Fix:** Check for missing commas or quotes
```javascript
// ❌ WRONG (missing comma)
{ id: "coffee", name: "Coffee" }
{ id: "tea", name: "Tea" }

// ✅ CORRECT
{ id: "coffee", name: "Coffee" },
{ id: "tea", name: "Tea" }
```

### Problem: "New item doesn't appear"
**Fix:** Check category spelling
```javascript
// ❌ WRONG
category: "hot coffee"     // lowercase
category: "Hot Coffees"    // extra 's'

// ✅ CORRECT
category: "Hot Coffee"     // exact match
```

### Problem: "Image shows broken"
**Fix:** Use valid Unsplash URL
```javascript
// ❌ WRONG (local file)
image: "/images/coffee.jpg"

// ✅ CORRECT (from web)
image: "https://images.unsplash.com/photo-..."
```

### Problem: "Description too long"
**Fix:** Keep under 100 characters
```javascript
// ❌ WRONG (too long)
description: "This is a premium espresso coffee made with carefully selected beans from Ethiopia..."

// ✅ CORRECT (concise)
description: "Premium Ethiopian espresso with rich chocolate notes."
```

---

## 📝 STEP-BY-STEP EXAMPLE

### Goal: Add "Affogato" (Ice Cream + Espresso)

**Step 1:** Open `c:\Users\mouhi\Desktop\Brew4You\data\menu.ts`

**Step 2:** Go to the END of the file

**Step 3:** Find the last item (Tea), add comma after closing brace:
```javascript
{
  id: "tea",
  name: "Tea",
  category: "Non Coffee",
  price: 250,
  description: "Fresh brewed tea with premium leaves and bright notes.",
  popular: false,
  intensity: 1,
  image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"
},  ← ADD COMMA HERE
```

**Step 4:** Add new item:
```javascript
{
  id: "affogato",
  name: "Affogato",
  category: "Cold Coffee",
  price: 380,
  description: "Vanilla ice cream topped with hot espresso pour.",
  popular: true,
  intensity: 3,
  image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"
}
```

**Step 5:** Save (Ctrl+S)

**Step 6:** Reload website → Affogato appears! ✅

---

## 🎓 KEY TAKEAWAYS

1. **All products stored in:** `data/menu.ts`
2. **Edit = Save = Update** (no database needed currently)
3. **To change price:** Find item → change price number → save
4. **To add item:** Copy template → fill fields → save
5. **Images:** Use free Unsplash URLs
6. **Categories:** Must match exactly (Hot Coffee, Cold Coffee, Frappes, Non Coffee)

---

**Ready to make changes? Open `data/menu.ts` and start editing! 🚀**

For questions, ask me anytime!
