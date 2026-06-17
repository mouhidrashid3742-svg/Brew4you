# EXAMPLES: How to edit your menu

This file provides examples and do/don't guidelines. It's documentation only — not code.

## Example: Change Price

Before:

```json
{
  "id": "espresso",
  "name": "Espresso",
  "category": "Hot Coffee",
  "price": 280,
  "description": "Rich Italian espresso with a silky crema finish.",
  "popular": true,
  "intensity": 5,
  "image": "https://..."
}
```

After (change price to 350):

```json
{
  "id": "espresso",
  "name": "Espresso",
  "category": "Hot Coffee",
  "price": 350,
  "description": "Rich Italian espresso with a silky crema finish.",
  "popular": true,
  "intensity": 5,
  "image": "https://..."
}
```

## Notes
- Valid categories: `Hot Coffee`, `Cold Coffee`, `Frappes`, `Non Coffee`
- Intensity: 1 (low) — 5 (very strong)
- Use numeric `price` values only (no currency text)

