# 📍 WHERE YOUR CONTENT IS STORED

## Quick Navigation

### Menu Items (Products/Coffee)
**File:** `data/menu.ts`
- Espresso, Americano, Cappuccino, etc.
- Edit: Change prices, add new items
- Format: JavaScript array with objects

### Blog Articles
**File:** `data/blogs.ts`
- Coffee Brewing Tips
- Difference Between Latte and Cappuccino
- Best Coffee Beans
- Matcha Benefits
- Edit: Update articles, change titles

### Images
**Source:** Unsplash (free)
- All images are hosted online
- You can change image URLs anytime
- No need to upload files currently

---

## 🚀 3 WAYS TO MANAGE YOUR CONTENT

### Method 1: DIRECT FILE EDITING (Current - Works Now!)
**Best For:** Quick changes, prices, descriptions
**Time:** 2 minutes per change
**Skill Level:** Easy (copy-paste)
**How:** Edit `data/menu.ts` → Save → Done

### Method 2: ADMIN DASHBOARD (Future - Built In!)
**Best For:** Long-term management
**Time:** 1 minute per change
**Skill Level:** Easy (click buttons)
**Setup:** Need MongoDB + We'll activate it
**URL:** `http://localhost:3000/admin/login`

### Method 3: HIRE SOMEONE (Optional)
**Best For:** When you're very busy
**Cost:** ~2,000-5,000 PKR per month
**Who:** Virtual assistant / Developer

---

## 📝 CONTENT YOU CAN EDIT

### ✅ EASY (Edit Now!)
- [x] Product prices - `data/menu.ts`
- [x] Product descriptions - `data/menu.ts`
- [x] Product images - `data/menu.ts`
- [x] Mark items as popular - `data/menu.ts`
- [x] Add new items - `data/menu.ts`
- [x] Blog articles - `data/blogs.ts`
- [x] Favorite items - Automatic (user saves)

### 🔧 MEDIUM (Need Setup)
- [ ] Admin dashboard - Needs MongoDB
- [ ] Admin login - Need strong password
- [ ] Email notifications - Need SendGrid
- [ ] Order notifications - Need WhatsApp API

### 🏗️ HARD (Future)
- [ ] Payment integration - Stripe/JazzCash
- [ ] Order tracking - Need backend
- [ ] Customer accounts - Need backend
- [ ] Loyalty program - Need backend

---

## 📂 FILE STRUCTURE

```
Brew4You/
├── data/
│   ├── menu.ts          ← EDIT THIS (Products)
│   └── blogs.ts         ← EDIT THIS (Articles)
├── app/
│   ├── page.tsx         (Home page)
│   ├── menu/
│   │   └── page.tsx     (Menu page)
│   ├── contact/
│   │   └── page.tsx     (Contact page)
│   ├── admin/           (Admin area - future)
│   └── ...
├── components/          (UI components)
├── public/              (Static files)
├── .env.local          ← YOUR PHONE NUMBERS
├── HOW_TO_EDIT.md      ← GUIDE (read this!)
└── SETUP_GUIDE.md      ← ANOTHER GUIDE
```

---

## ⚡ FASTEST WAY TO MAKE CHANGES

### Change a Price
1. Open: `data/menu.ts`
2. Find: Item name (Ctrl+F)
3. Change: The number after `price:`
4. Save: Ctrl+S
5. Done: Website updates automatically

### Add a New Item
1. Open: `data/menu.ts`
2. Go to: End of appropriate section
3. Copy: Item template (see HOW_TO_EDIT.md)
4. Paste: After last item (with comma)
5. Edit: Name, price, description, etc.
6. Save: Ctrl+S
7. Done: New item appears on menu

### Change Product Image
1. Open: `data/menu.ts`
2. Find: Item's `image:` field
3. Go to: Unsplash.com
4. Search: "coffee" or drink name
5. Copy: Image URL
6. Paste: Over old URL
7. Save: Ctrl+S
8. Done: New image shows

---

## 💡 TIPS FOR EDITING

### BEFORE YOU START
- ✅ Backup the file (copy data/menu.ts)
- ✅ Have examples handy (see EXAMPLES.ts)
- ✅ Know what you want to change

### WHILE EDITING
- ✅ Use Ctrl+F to find items quickly
- ✅ Keep descriptions under 100 characters
- ✅ Use proper pricing (whole numbers, no decimals)
- ✅ Don't delete commas between items

### AFTER SAVING
- ✅ Reload browser (F5)
- ✅ Check menu page to verify
- ✅ Test on mobile too
- ✅ Make sure prices are correct

---

## 🔍 HOW TO FIND & EDIT ITEMS

### Finding "Cappuccino" and Changing Price

**Step 1:** Open `data/menu.ts`
**Step 2:** Press Ctrl+F (Find)
**Step 3:** Type "cappuccino"
**Step 4:** Find and select
**Step 5:** You'll see:
```javascript
{
  id: "cappuccino",
  name: "Cappuccino",
  category: "Hot Coffee",
  price: 380,        ← FIND THIS
  description: "...",
  popular: true,
  intensity: 4,
  image: "..."
}
```

**Step 6:** Change price, save, done!

---

## 📊 PRICING TIPS

### Smart Pricing Strategy
```
Hot Coffee:    250-450 PKR
Cold Coffee:   300-500 PKR
Frappes:       400-550 PKR
Non Coffee:    250-450 PKR
```

### When to Raise Prices
- ✅ When ingredients cost more
- ✅ When demand is high (popular items)
- ✅ During peak season
- ✅ If popular badge is getting orders

### When to Lower Prices
- ✅ To attract new customers
- ✅ For seasonal sales
- ✅ For combo deals
- ✅ Off-peak hours

---

## 🎯 BEST PRACTICES

### Descriptions
✅ **Good:**
- "Rich Italian espresso with creamy foam"
- "Premium cold brew with smooth taste"
- "Sweet matcha latte for calm energy"

❌ **Bad:**
- "Coffee" (too vague)
- "Super delicious amazing wonderful" (too much)
- "Lorem ipsum dolor sit" (gibberish)

### Names
✅ **Good:**
- "Dalgona Coffee"
- "Spanish Latte"
- "Cold Brew"

❌ **Bad:**
- "Coffee" (too generic)
- "CAPPUCCINO SPECIAL DELUXE" (too long)
- "Cap" (too short)

### Images
✅ **Good:**
- Professional coffee photos
- Clear, high-quality
- Shows the drink

❌ **Bad:**
- Blurry images
- Wrong drink type
- Broken links

---

## 🚨 IF SOMETHING BREAKS

### Website Shows Error
1. Check for missing commas
2. Check for missing quotes
3. Find the error line
4. Ask me - I'll fix it!

### New Item Doesn't Show
1. Check spelling of category
2. Check if you added it in correct section
3. Reload browser (hard refresh: Ctrl+Shift+R)

### Price Not Updating
1. Make sure you saved (Ctrl+S)
2. Hard refresh browser (Ctrl+Shift+R)
3. Check if you edited correct item

### Image Broken
1. Copy fresh URL from Unsplash
2. Make sure URL is complete
3. Test if it's a valid image

---

## 📞 QUICK CONTACTS

### File Help
- Open file: `data/menu.ts`
- Edit: Change what you want
- Save: Ctrl+S
- Reload: F5

### If Stuck
- Check: `HOW_TO_EDIT.md` (comprehensive guide)
- Check: `EXAMPLES.ts` (code examples)
- Ask me: I'm here to help!

### Common Tasks
| Task | File | Action |
|------|------|--------|
| Change Price | `data/menu.ts` | Edit number after `price:` |
| Add Item | `data/menu.ts` | Copy template, fill fields |
| Change Description | `data/menu.ts` | Edit text after `description:` |
| Mark Popular | `data/menu.ts` | Change `popular: false` to `true` |
| Add Blog | `data/blogs.ts` | Copy blog template |

---

## ✨ READY TO GO!

You now have everything to manage your website:
- ✅ Know where files are stored
- ✅ Know how to edit prices
- ✅ Know how to add items
- ✅ Have example code
- ✅ Have step-by-step guides

**Time to start editing! 🚀**

---

**Still have questions? Ask me anytime!**
