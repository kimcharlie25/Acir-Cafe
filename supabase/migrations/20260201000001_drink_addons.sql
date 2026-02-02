/*
  # Add Drink Add-Ons for All Beverage Menu Items
  
  This script adds the following add-ons to all drink items:
  - Espresso Shot: ₱50
  - Milk: ₱50
  - Whipped Cream: ₱30
  - Sauce (Drizzle): ₱20 (chocolate/caramel)
  - Flavored Syrups: ₱20 (strawberry/greenapple/lychee/hazelnut/vanilla/sweetener)

  Applies to categories: coffee, colored-latte, frappe, froyo, k-drinks, coconut-drinks
*/

-- Add Espresso Shot to all drink items
INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Espresso Shot', 50, 'extras'
FROM menu_items 
WHERE category IN ('coffee', 'colored-latte', 'frappe', 'froyo', 'k-drinks', 'coconut-drinks');

-- Add Milk to all drink items
INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Milk', 50, 'extras'
FROM menu_items 
WHERE category IN ('coffee', 'colored-latte', 'frappe', 'froyo', 'k-drinks', 'coconut-drinks');

-- Add Whipped Cream to all drink items
INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Whipped Cream', 30, 'extras'
FROM menu_items 
WHERE category IN ('coffee', 'colored-latte', 'frappe', 'froyo', 'k-drinks', 'coconut-drinks');

-- Add Sauce (Drizzle) - Chocolate to all drink items
INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Chocolate Drizzle', 20, 'sauce'
FROM menu_items 
WHERE category IN ('coffee', 'colored-latte', 'frappe', 'froyo', 'k-drinks', 'coconut-drinks');

-- Add Sauce (Drizzle) - Caramel to all drink items
INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Caramel Drizzle', 20, 'sauce'
FROM menu_items 
WHERE category IN ('coffee', 'colored-latte', 'frappe', 'froyo', 'k-drinks', 'coconut-drinks');

-- Add Flavored Syrups - Strawberry
INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Strawberry Syrup', 20, 'syrup'
FROM menu_items 
WHERE category IN ('coffee', 'colored-latte', 'frappe', 'froyo', 'k-drinks', 'coconut-drinks');

-- Add Flavored Syrups - Green Apple
INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Green Apple Syrup', 20, 'syrup'
FROM menu_items 
WHERE category IN ('coffee', 'colored-latte', 'frappe', 'froyo', 'k-drinks', 'coconut-drinks');

-- Add Flavored Syrups - Lychee
INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Lychee Syrup', 20, 'syrup'
FROM menu_items 
WHERE category IN ('coffee', 'colored-latte', 'frappe', 'froyo', 'k-drinks', 'coconut-drinks');

-- Add Flavored Syrups - Hazelnut
INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Hazelnut Syrup', 20, 'syrup'
FROM menu_items 
WHERE category IN ('coffee', 'colored-latte', 'frappe', 'froyo', 'k-drinks', 'coconut-drinks');

-- Add Flavored Syrups - Vanilla
INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Vanilla Syrup', 20, 'syrup'
FROM menu_items 
WHERE category IN ('coffee', 'colored-latte', 'frappe', 'froyo', 'k-drinks', 'coconut-drinks');

-- Add Flavored Syrups - Sweetener
INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Sweetener', 20, 'syrup'
FROM menu_items 
WHERE category IN ('coffee', 'colored-latte', 'frappe', 'froyo', 'k-drinks', 'coconut-drinks');
