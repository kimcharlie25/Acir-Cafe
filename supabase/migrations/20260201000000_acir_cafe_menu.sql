/*
  # Add Acir Cafe Menu Items
  
  1. Categories:
    - COFFEE
    - COLORED LATTE
    - FRAPPE
    - FROYO SERIES
    - K-DRINKS
    - COCONUT DRINKS
    - ADD-ONS
    - APPETIZER
    - ALL TIME BREAKFAST
    - PASTA
    - SANDWICH
    - RICE BOWL
    - MAIN COURSE
    - GROUP MEAL
    - CAKES & COOKIES
    - EXTRAS

  2. Features:
    - Auto-generated UUIDs for all items
    - Variations for coffee items (Ice 16oz / Hot 12oz)
    - Variations for pasta items (Solo / Platter)
*/

-- ============================================
-- INSERT CATEGORIES FIRST (to satisfy FK constraint)
-- ============================================
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('coffee', 'Coffee', '☕', 1, true),
  ('colored-latte', 'Colored Latte', '🥛', 2, true),
  ('frappe', 'Frappe', '🧋', 3, true),
  ('froyo', 'Froyo Series', '🍦', 4, true),
  ('k-drinks', 'K-Drinks', '🧃', 5, true),
  ('coconut-drinks', 'Coconut Drinks', '🥥', 6, true),
  ('add-ons', 'Add-Ons', '➕', 7, true),
  ('appetizer', 'Appetizer', '🍟', 8, true),
  ('breakfast', 'All Time Breakfast', '🍳', 9, true),
  ('pasta', 'Pasta', '🍝', 10, true),
  ('sandwich', 'Sandwich', '🥪', 11, true),
  ('rice-bowl', 'Rice Bowl', '🍚', 12, true),
  ('main-course', 'Main Course', '🍽️', 13, true),
  ('group-meal', 'Group Meal', '👥', 14, true),
  ('cakes-cookies', 'Cakes & Cookies', '🍰', 15, true),
  ('extras', 'Extras', '🛒', 16, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- COFFEE
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Acir Coffee', 'Signature coffee w/ Irish cream & dash of cinnamon', 190, 'coffee', true, true, NULL),
  ('Americano', 'Classic espresso with hot water (unsweetened/sweetened)', 120, 'coffee', false, true, NULL),
  ('Cappuccino', 'Espresso with steamed milk foam (unsweetened/sweetened)', 140, 'coffee', false, true, NULL),
  ('Latte', 'Espresso with steamed milk (unsweetened/sweetened)', 140, 'coffee', false, true, NULL),
  ('Vanilla', 'Vanilla flavored latte', 160, 'coffee', false, true, NULL),
  ('Caramel Macchiato', 'Espresso with vanilla, milk, and caramel drizzle', 170, 'coffee', true, true, NULL),
  ('Seasalt Butterscotch', 'Rich butterscotch latte with sea salt', 180, 'coffee', false, true, NULL),
  ('Spanish Latte', 'Espresso with condensed milk', 180, 'coffee', true, true, NULL),
  ('Choco Hazelnut', 'Chocolate and hazelnut latte', 180, 'coffee', false, true, NULL),
  ('Dirty Matcha', 'Matcha latte with espresso shot', 190, 'coffee', false, true, NULL),
  ('White Chocolate Mocha', 'Espresso w/ white chocolate syrup & whip cream', 190, 'coffee', false, true, NULL),
  ('Crème Brûlée', 'Latte w/ creme brulee syrup & whip cream', 190, 'coffee', false, true, NULL);

-- Add variations for coffee items (Ice 16oz / Hot 12oz)
INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Ice 16oz', 0 FROM menu_items WHERE category = 'coffee' AND name IN ('Acir Coffee', 'Americano', 'Cappuccino', 'Latte', 'Vanilla', 'Caramel Macchiato', 'Seasalt Butterscotch', 'Spanish Latte', 'Choco Hazelnut', 'Dirty Matcha', 'White Chocolate Mocha', 'Crème Brûlée');

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Hot 12oz', 0 FROM menu_items WHERE category = 'coffee' AND name IN ('Acir Coffee', 'Americano', 'Cappuccino', 'Latte', 'Vanilla', 'Caramel Macchiato', 'Seasalt Butterscotch', 'Spanish Latte', 'Choco Hazelnut', 'Dirty Matcha', 'White Chocolate Mocha', 'Crème Brûlée');

-- ============================================
-- COLORED LATTE (Milk base)
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Matcha Latte', 'Premium matcha with steamed milk (served ice and hot)', 180, 'colored-latte', true, true, NULL),
  ('Strawberry Matcha Latte', 'Strawberry and matcha fusion', 180, 'colored-latte', false, true, NULL),
  ('Strawberry Latte', 'Sweet strawberry milk latte', 170, 'colored-latte', false, true, NULL),
  ('Ube Latte', 'Filipino purple yam latte (served ice and hot)', 150, 'colored-latte', true, true, NULL),
  ('Melon Latte', 'Sweet melon flavored latte', 150, 'colored-latte', false, true, NULL),
  ('Choco Latte', 'Rich chocolate latte (served ice and hot)', 150, 'colored-latte', false, true, NULL),
  ('Choco Strawberry Latte', 'Chocolate and strawberry fusion', 160, 'colored-latte', false, true, NULL);

-- ============================================
-- FRAPPE
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Mocha Frappe', 'Blended coffee frappe with chocolate (coffee base)', 200, 'frappe', true, true, NULL),
  ('Caramel Frappe', 'Blended coffee frappe with caramel (coffee base)', 200, 'frappe', false, true, NULL),
  ('Matcha Cheesecake', 'Matcha frappe with cheesecake flavor', 200, 'frappe', false, true, NULL),
  ('Strawberry Cheesecake', 'Strawberry frappe with cheesecake flavor', 200, 'frappe', false, true, NULL),
  ('Blueberry Cheesecake', 'Blueberry frappe with cheesecake flavor', 200, 'frappe', false, true, NULL),
  ('Strawberry Frappe', 'Classic strawberry blended frappe', 190, 'frappe', false, true, NULL),
  ('Chocolate Frappe', 'Rich chocolate blended frappe', 190, 'frappe', false, true, NULL),
  ('Oreo Cheese Frappe', 'Oreo and cream cheese blended frappe', 220, 'frappe', true, true, NULL),
  ('Biscoff Frappe', 'Biscoff cookie blended frappe', 220, 'frappe', false, true, NULL),
  ('Banana Strawberry', 'Banana and strawberry blended frappe', 200, 'frappe', false, true, NULL),
  ('Banana Choconut', 'Banana, chocolate, and coconut blended frappe', 200, 'frappe', false, true, NULL);

-- ============================================
-- FROYO SERIES (Yogurt base)
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Mango Froyo', 'Frozen yogurt with mango flavor', 200, 'froyo', false, true, NULL),
  ('Strawberry Froyo', 'Frozen yogurt with strawberry flavor', 200, 'froyo', false, true, NULL),
  ('Blueberry Froyo', 'Frozen yogurt with blueberry flavor', 200, 'froyo', false, true, NULL);

-- ============================================
-- K-DRINKS
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Strawberry Ade', 'Refreshing strawberry drink (soda base)', 130, 'k-drinks', false, true, NULL),
  ('Green Apple Ade', 'Refreshing green apple drink (soda base)', 130, 'k-drinks', false, true, NULL),
  ('Lychee Ade', 'Refreshing lychee drink (soda base)', 130, 'k-drinks', false, true, NULL),
  ('Strawberry Yakult', 'Strawberry with Yakult probiotic drink', 160, 'k-drinks', true, true, NULL),
  ('Blueberry Yakult', 'Blueberry with Yakult probiotic drink', 160, 'k-drinks', false, true, NULL),
  ('Mango Yakult', 'Mango with Yakult probiotic drink', 160, 'k-drinks', false, true, NULL),
  ('Strawberry Lychee Yakult', 'Strawberry and lychee with Yakult', 160, 'k-drinks', false, true, NULL);

-- ============================================
-- COCONUT DRINKS (Coconut water base)
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Coco Americano', 'Coconut water with espresso', 150, 'coconut-drinks', false, true, NULL),
  ('Coco Matcha', 'Coconut water with matcha', 200, 'coconut-drinks', false, true, NULL),
  ('Coco Choco', 'Coconut water with chocolate', 180, 'coconut-drinks', false, true, NULL),
  ('Coco Ube', 'Coconut water with ube (purple yam)', 180, 'coconut-drinks', false, true, NULL);

-- ============================================
-- ADD-ONS (For drinks only)
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Espresso Shot', 'Extra shot of espresso', 50, 'add-ons', false, true, NULL),
  ('Milk', 'Extra milk', 50, 'add-ons', false, true, NULL),
  ('Whipped Cream', 'Whipped cream topping', 30, 'add-ons', false, true, NULL),
  ('Sauce (Drizzle)', 'Chocolate or caramel drizzle', 20, 'add-ons', false, true, NULL),
  ('Flavored Syrups', 'Strawberry, green apple, lychee, hazelnut, vanilla, or sweetener', 20, 'add-ons', false, true, NULL);

-- ============================================
-- APPETIZER
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Nachos', 'Crispy tortilla chips with toppings', 350, 'appetizer', true, true, NULL),
  ('Fish and Dip', 'Fried fish with dipping sauce', 200, 'appetizer', false, true, NULL),
  ('Mozzarella Sticks', 'Breaded and fried mozzarella sticks', 220, 'appetizer', false, true, NULL),
  ('Quesadilla', 'Flour tortilla with beef & spinach filling', 300, 'appetizer', false, true, NULL),
  ('Crinkle Fries', 'Crinkle cut fries (cheese, sourcream, or barbecue)', 200, 'appetizer', false, true, NULL),
  ('Calamares', 'Deep fried squid rings', 250, 'appetizer', false, true, NULL),
  ('Platter Appetizer', 'Assorted appetizer platter for sharing', 600, 'appetizer', true, true, NULL);

-- ============================================
-- ALL TIME BREAKFAST (No drink included)
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Hotsilog', 'Hotdog with sinangag (garlic rice) and itlog (egg)', 200, 'breakfast', false, true, NULL),
  ('Tapsilog', 'Beef tapa with sinangag (garlic rice) and itlog (egg)', 200, 'breakfast', true, true, NULL),
  ('Bangusilog', 'Bangus (milkfish) with sinangag (garlic rice) and itlog (egg)', 200, 'breakfast', false, true, NULL),
  ('Liemposilog', 'Pork liempo with sinangag (garlic rice) and itlog (egg)', 200, 'breakfast', false, true, NULL);

-- ============================================
-- PASTA (Solo / Platter)
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Creamy Carbonara', 'Classic creamy carbonara pasta', 250, 'pasta', true, true, NULL),
  ('Chicken Pesto', 'Pasta with chicken and pesto sauce', 270, 'pasta', false, true, NULL),
  ('Tuna Pasta', 'Pasta with tuna in creamy sauce', 250, 'pasta', false, true, NULL);

-- Add variations for pasta (Solo / Platter)
INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Solo', 0 FROM menu_items WHERE category = 'pasta' AND name IN ('Creamy Carbonara', 'Chicken Pesto', 'Tuna Pasta');

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Platter', 350 FROM menu_items WHERE name = 'Creamy Carbonara' AND category = 'pasta';

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Platter', 380 FROM menu_items WHERE name = 'Chicken Pesto' AND category = 'pasta';

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Platter', 350 FROM menu_items WHERE name = 'Tuna Pasta' AND category = 'pasta';

-- ============================================
-- SANDWICH
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Clubhouse', 'Classic clubhouse sandwich', 200, 'sandwich', false, true, NULL);

-- ============================================
-- RICE BOWL (No drink included)
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Chicken Ala King', 'Creamy chicken ala king served over rice', 270, 'rice-bowl', false, true, NULL),
  ('Chicken Sweet & Sour', 'Sweet and sour chicken served over rice', 270, 'rice-bowl', false, true, NULL),
  ('Chicken Curry', 'Chicken curry served over rice', 270, 'rice-bowl', false, true, NULL),
  ('Pork Binagoongan', 'Pork cooked in shrimp paste served over rice', 280, 'rice-bowl', true, true, NULL),
  ('Pork Sisig', 'Sizzling pork sisig served over rice', 280, 'rice-bowl', true, true, NULL),
  ('Pork Bicol Express', 'Spicy pork in coconut milk served over rice', 280, 'rice-bowl', false, true, NULL),
  ('Beef Caldereta', 'Beef stew in tomato sauce served over rice', 300, 'rice-bowl', false, true, NULL),
  ('Beef Broccoli', 'Beef and broccoli stir fry served over rice', 300, 'rice-bowl', false, true, NULL),
  ('Bistek Tagalog', 'Filipino-style beef steak served over rice', 300, 'rice-bowl', false, true, NULL);

-- ============================================
-- MAIN COURSE (No drink included)
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Creamy Salmon', 'Salmon fillet in creamy sauce with sides', 420, 'main-course', true, true, NULL),
  ('Grilled Liempo', 'Grilled pork belly with sides', 300, 'main-course', false, true, NULL),
  ('Chicken Barbecue', 'Filipino-style chicken barbecue with sides', 300, 'main-course', false, true, NULL),
  ('Fried Chicken', 'Crispy fried chicken with sides', 300, 'main-course', false, true, NULL),
  ('Spicy Beef', 'Spicy beef dish with sides', 350, 'main-course', false, true, NULL);

-- ============================================
-- GROUP MEAL (No rice & drink included)
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Pork Sisig (2-3 persons)', 'Sizzling pork sisig for sharing', 350, 'group-meal', true, true, NULL),
  ('Pork Binagoongan (2-3 persons)', 'Pork in shrimp paste for sharing', 450, 'group-meal', false, true, NULL),
  ('Pork Bicol Express (2-3 persons)', 'Spicy pork in coconut milk for sharing', 450, 'group-meal', false, true, NULL),
  ('Crispy Kare-kare (2-3 persons)', 'Crispy oxtail in peanut sauce for sharing', 550, 'group-meal', false, true, NULL),
  ('Letchon Kawali (2-3 persons)', 'Crispy deep fried pork belly for sharing', 500, 'group-meal', true, true, NULL),
  ('Beef Kare-kare (2-3 persons)', 'Beef in peanut sauce for sharing', 600, 'group-meal', false, true, NULL),
  ('Beef Caldereta (2-3 persons)', 'Beef stew in tomato sauce for sharing', 600, 'group-meal', false, true, NULL),
  ('Beef Broccoli (2-3 persons)', 'Beef and broccoli stir fry for sharing', 600, 'group-meal', false, true, NULL),
  ('Chicken Wings (3-4 persons)', 'Chicken wings (parmesan or buffalo) for sharing', 550, 'group-meal', false, true, NULL),
  ('Bulalo (3-4 persons)', 'Beef bone marrow soup for sharing', 700, 'group-meal', true, true, NULL),
  ('Pork Sinigang (3-4 persons)', 'Pork in sour tamarind soup for sharing', 650, 'group-meal', false, true, NULL),
  ('Sinigang Salmon Belly (3-4 persons)', 'Salmon belly in sour tamarind soup for sharing', 650, 'group-meal', false, true, NULL);

-- ============================================
-- CAKES & COOKIES
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Dreamcake', 'Dreamcake (Vanilla, Biscoff, or Choco Almond)', 180, 'cakes-cookies', true, true, NULL),
  ('Oreo Cheesecake', 'Creamy cheesecake with Oreo cookie crust', 150, 'cakes-cookies', false, true, NULL),
  ('Blueberry Cheesecake', 'Creamy cheesecake with blueberry topping', 150, 'cakes-cookies', false, true, NULL),
  ('Tiramisu', 'Classic Italian coffee-flavored dessert', 220, 'cakes-cookies', true, true, NULL),
  ('Cookies', 'Assorted cookies (Nutella Walnut, Hershey Mallow, Meiji Rocky Road, Choco Butternut)', 120, 'cakes-cookies', false, true, NULL);

-- Add variations for Dreamcake
INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Vanilla', 0 FROM menu_items WHERE name = 'Dreamcake' AND category = 'cakes-cookies';

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Biscoff', 0 FROM menu_items WHERE name = 'Dreamcake' AND category = 'cakes-cookies';

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Choco Almond', 0 FROM menu_items WHERE name = 'Dreamcake' AND category = 'cakes-cookies';

-- Add variations for Cookies
INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Nutella Walnut', 0 FROM menu_items WHERE name = 'Cookies' AND category = 'cakes-cookies';

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Hershey Mallow', 0 FROM menu_items WHERE name = 'Cookies' AND category = 'cakes-cookies';

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Meiji Rocky Road', 0 FROM menu_items WHERE name = 'Cookies' AND category = 'cakes-cookies';

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Choco Butternut', 0 FROM menu_items WHERE name = 'Cookies' AND category = 'cakes-cookies';

-- ============================================
-- EXTRAS
-- ============================================
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
  ('Plain Rice', 'Steamed white rice', 30, 'extras', false, true, NULL),
  ('Garlic Rice', 'Sinangag - Filipino garlic fried rice', 40, 'extras', false, true, NULL),
  ('Platter Rice', 'Rice platter good for 5 persons', 110, 'extras', false, true, NULL),
  ('Bottled Water', 'Bottled drinking water', 20, 'extras', false, true, NULL),
  ('Cheese Sauce', 'Extra cheese sauce', 50, 'extras', false, true, NULL),
  ('Garlic Bread', 'Toasted garlic bread', 30, 'extras', false, true, NULL),
  ('Ground Beef', 'Extra ground beef', 70, 'extras', false, true, NULL),
  ('Bagoong', 'Shrimp paste condiment', 30, 'extras', false, true, NULL),
  ('Egg', 'Fried egg', 40, 'extras', false, true, NULL);
