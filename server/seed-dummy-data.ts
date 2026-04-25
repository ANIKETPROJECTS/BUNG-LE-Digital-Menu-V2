import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";
const client = new MongoClient(MONGODB_URI);
const restaurantId = new ObjectId("6874cff2a880250859286de6");

const now = new Date();

function makeItem(name: string, description: string, price: number | string, isVeg: boolean, image: string, category: string) {
  return { name, description, price, category, isVeg, image, restaurantId, isAvailable: true, createdAt: now, updatedAt: now, __v: 0 };
}

const seedData: Record<string, ReturnType<typeof makeItem>[]> = {
  "nibbles": [
    makeItem("Masala Papad", "Crispy papad topped with diced onions, tomatoes, green chillies and chaat masala", 120, true, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", "nibbles"),
    makeItem("Roasted Peanuts", "Spiced and roasted peanuts tossed with herbs and lime", 90, true, "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=400", "nibbles"),
    makeItem("Chilli Cheese Toast", "Toasted bread topped with melted cheese and green chillies", 180, true, "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400", "nibbles"),
    makeItem("Chicken Lollipop (3 pcs)", "Crispy fried chicken lollipops marinated in fiery spices", 280, false, "https://images.unsplash.com/photo-1626082896492-766af4eb6501?w=400", "nibbles"),
    makeItem("Spicy Nachos", "Corn tortilla chips with salsa, jalapeños and sour cream", 220, true, "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400", "nibbles"),
  ],
  "soups": [
    makeItem("Tomato Basil Soup", "Classic creamy tomato soup with fresh basil and a drizzle of cream", 180, true, "https://images.unsplash.com/photo-1547592180-85f173990554?w=400", "soups"),
    makeItem("Mushroom Soup", "Rich and creamy wild mushroom soup with herbs and garlic bread", 200, true, "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400", "soups"),
    makeItem("Chicken Sweet Corn Soup", "Classic Chinese-style sweet corn soup with tender chicken shreds", 190, false, "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400", "soups"),
    makeItem("Hot & Sour Soup", "Tangy and spicy soup with vegetables, tofu and bamboo shoots", 175, true, "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400", "soups"),
    makeItem("Shorba", "Traditional Indian lamb broth with aromatic spices", 210, false, "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400", "soups"),
  ],
  "titbits": [
    makeItem("Bruschetta", "Toasted sourdough topped with tomatoes, garlic, basil and olive oil", 220, true, "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400", "titbits"),
    makeItem("Paneer Tikka (6 pcs)", "Cottage cheese marinated in yoghurt and spices, grilled in a tandoor", 320, true, "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400", "titbits"),
    makeItem("Fish Finger (4 pcs)", "Golden fried fish fingers served with tartar sauce", 310, false, "https://images.unsplash.com/photo-1510130315284-39d98ae3f7b7?w=400", "titbits"),
    makeItem("Veg Spring Rolls (4 pcs)", "Crispy spring rolls filled with spiced vegetables", 200, true, "https://images.unsplash.com/photo-1544025162-d76694265947?w=400", "titbits"),
    makeItem("Chicken Seekh Kebab (3 pcs)", "Minced chicken with herbs and spices on skewers, grilled to perfection", 340, false, "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400", "titbits"),
  ],
  "salads": [
    makeItem("Caesar Salad", "Romaine lettuce, parmesan, croutons with classic Caesar dressing", 280, true, "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400", "salads"),
    makeItem("Greek Salad", "Fresh cucumbers, tomatoes, olives, feta cheese with herb dressing", 260, true, "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400", "salads"),
    makeItem("Grilled Chicken Salad", "Grilled chicken breast on a bed of greens with honey mustard dressing", 320, false, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", "salads"),
    makeItem("Kachumber Salad", "Classic Indian salad with diced onions, tomatoes, cucumber and lemon", 150, true, "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400", "salads"),
    makeItem("Watermelon Feta Salad", "Fresh watermelon cubes with feta, mint and a balsamic glaze", 240, true, "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400", "salads"),
  ],
  "mangalorean-style": [
    makeItem("Kori Rotti", "Traditional Mangalorean chicken curry served with crispy rice wafers", 380, false, "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400", "mangalorean-style"),
    makeItem("Prawn Gassi", "Mangalorean coconut-based prawn curry with fresh ground masala", 450, false, "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400", "mangalorean-style"),
    makeItem("Neer Dosa", "Delicate rice crepes served with coconut chutney", 180, true, "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400", "mangalorean-style"),
    makeItem("Bangude Pulimunchi", "Spicy mackerel fish curry in a tangy tamarind-based gravy", 390, false, "https://images.unsplash.com/photo-1626777553635-be342a958a2b?w=400", "mangalorean-style"),
    makeItem("Chicken Sukka", "Dry Mangalorean chicken preparation with freshly roasted coconut masala", 400, false, "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400", "mangalorean-style"),
  ],
  "wok": [
    makeItem("Veg Stir Fry Noodles", "Fresh vegetables and noodles tossed in a savory soy sauce", 260, true, "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400", "wok"),
    makeItem("Chilli Chicken Dry", "Crispy chicken tossed with peppers, onions and chilli sauce", 340, false, "https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=400", "wok"),
    makeItem("Kung Pao Prawn", "Prawns tossed with peanuts, chillies and Sichuan sauce", 420, false, "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400", "wok"),
    makeItem("Tofu & Broccoli Stir Fry", "Silken tofu and broccoli florets in garlic and black bean sauce", 280, true, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", "wok"),
    makeItem("Beef Black Pepper", "Tender beef slices stir-fried with fresh pepper and vegetables", 480, false, "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400", "wok"),
  ],
  "charcoal": [
    makeItem("Charcoal Grilled Chicken", "Half chicken marinated in herb butter and grilled over charcoal", 480, false, "https://images.unsplash.com/photo-1598103442097-8b74394b95c8?w=400", "charcoal"),
    makeItem("Tandoori Prawns (6 pcs)", "Jumbo prawns marinated with tandoori spices and grilled in clay oven", 520, false, "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400", "charcoal"),
    makeItem("Paneer Shashlik", "Cottage cheese and pepper skewers grilled over live charcoal", 350, true, "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400", "charcoal"),
    makeItem("Mutton Seekh Kebab (3 pcs)", "Minced mutton blended with fresh herbs and charcoal grilled on skewers", 420, false, "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400", "charcoal"),
    makeItem("Charcoal Corn on Cob", "Sweet corn grilled over charcoal with herb butter and spices", 140, true, "https://images.unsplash.com/photo-1601360557091-4aedc4af0a73?w=400", "charcoal"),
  ],
  "continental": [
    makeItem("Grilled Salmon", "Atlantic salmon fillet with lemon butter sauce and seasonal vegetables", 680, false, "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400", "continental"),
    makeItem("Chicken Cordon Bleu", "Chicken breast stuffed with ham and cheese, pan-fried golden", 560, false, "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400", "continental"),
    makeItem("Mushroom Risotto", "Creamy Arborio rice with wild mushrooms, parmesan and truffle oil", 420, true, "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400", "continental"),
    makeItem("Beef Steak", "200g premium beef steak cooked to your liking with fries and sauce", 850, false, "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400", "continental"),
    makeItem("Vegetable Quiche", "Classic French tart with seasonal vegetables and cheese custard filling", 360, true, "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400", "continental"),
  ],
  "pasta": [
    makeItem("Pasta Arrabiata", "Penne pasta in a spicy tomato and garlic sauce with basil", 280, true, "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400", "pasta"),
    makeItem("Chicken Alfredo", "Fettuccine tossed in a rich cream sauce with grilled chicken", 360, false, "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400", "pasta"),
    makeItem("Spaghetti Aglio e Olio", "Spaghetti with garlic, olive oil, chilli flakes and parsley", 260, true, "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400", "pasta"),
    makeItem("Prawn Pesto Linguine", "Linguine tossed in basil pesto with sautéed prawns and cherry tomatoes", 420, false, "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400", "pasta"),
    makeItem("Mac & Cheese", "Creamy four-cheese macaroni baked with a crispy breadcrumb topping", 300, true, "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400", "pasta"),
  ],
  "artisan-pizzas": [
    makeItem("Margherita", "Classic tomato base with fresh mozzarella and basil on thin crust", 320, true, "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", "artisan-pizzas"),
    makeItem("BBQ Chicken Pizza", "Smoked chicken, mozzarella and BBQ sauce on a hand-stretched base", 420, false, "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", "artisan-pizzas"),
    makeItem("Peri Peri Paneer Pizza", "Spicy peri peri sauce, paneer, onions and capsicum on wood-fired crust", 380, true, "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=400", "artisan-pizzas"),
    makeItem("Pepperoni Classic", "Loaded with pepperoni slices and mozzarella on a rich tomato base", 450, false, "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400", "artisan-pizzas"),
    makeItem("Truffle Mushroom Pizza", "Wild mushrooms, truffle oil and goat cheese on an herb-infused crust", 480, true, "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", "artisan-pizzas"),
  ],
  "mini-burger-sliders": [
    makeItem("Crispy Chicken Slider (3 pcs)", "Crispy fried chicken patty with coleslaw and chipotle mayo in mini buns", 320, false, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", "mini-burger-sliders"),
    makeItem("Lamb Kheema Slider (3 pcs)", "Spiced minced lamb patty with caramelised onions and mint chutney", 380, false, "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=400", "mini-burger-sliders"),
    makeItem("Veg Paneer Slider (3 pcs)", "Grilled paneer patty with lettuce, tomato and sriracha mayo", 280, true, "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400", "mini-burger-sliders"),
    makeItem("Prawn Slider (3 pcs)", "Tempura prawns with avocado and tangy sauce in toasted buns", 420, false, "https://images.unsplash.com/photo-1596956470007-2bf6095e7e16?w=400", "mini-burger-sliders"),
    makeItem("Classic Beef Slider (3 pcs)", "Juicy beef patty with cheddar, pickles and signature burger sauce", 400, false, "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400", "mini-burger-sliders"),
  ],
  "entree-(main-course)": [
    makeItem("Grilled Sea Bass", "Pan-seared sea bass with lemon caper butter and steamed vegetables", 720, false, "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400", "entree-(main-course)"),
    makeItem("Chicken Schnitzel", "Breaded chicken breast pan-fried to golden with potato salad", 540, false, "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400", "entree-(main-course)"),
    makeItem("Stuffed Bell Peppers", "Bell peppers filled with spiced rice and cheese, baked to perfection", 380, true, "https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=400", "entree-(main-course)"),
    makeItem("Lamb Rack", "French-trimmed lamb rack with rosemary jus and mashed potato", 920, false, "https://images.unsplash.com/photo-1514516345957-556ca927d522?w=400", "entree-(main-course)"),
    makeItem("Portobello Steak", "Marinated portobello mushroom steak with truffle sauce and vegetables", 440, true, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", "entree-(main-course)"),
  ],
  "bao-&-dim-sum": [
    makeItem("Pork BBQ Bao (2 pcs)", "Steamed fluffy buns filled with char siu BBQ pork", 280, false, "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400", "bao-&-dim-sum"),
    makeItem("Veg Dim Sum (4 pcs)", "Steamed dumplings filled with cabbage, carrot and mushroom", 240, true, "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400", "bao-&-dim-sum"),
    makeItem("Chicken Gyoza (5 pcs)", "Pan-fried Japanese chicken dumplings with ponzu dipping sauce", 320, false, "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400", "bao-&-dim-sum"),
    makeItem("Prawn Har Gow (4 pcs)", "Delicate steamed prawn dumplings in translucent rice skin", 360, false, "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400", "bao-&-dim-sum"),
    makeItem("Mushroom Bao (2 pcs)", "Fluffy steamed bao with sautéed wild mushrooms and hoisin glaze", 240, true, "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400", "bao-&-dim-sum"),
  ],
  "indian-mains---curries": [
    makeItem("Butter Chicken", "Tender chicken in a rich creamy tomato-based sauce with aromatic spices", 380, false, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400", "indian-mains---curries"),
    makeItem("Paneer Lababdar", "Cottage cheese cubes in a rich, tangy tomato-onion gravy", 340, true, "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400", "indian-mains---curries"),
    makeItem("Mutton Rogan Josh", "Slow-cooked lamb in a Kashmiri spice-laced red gravy", 460, false, "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400", "indian-mains---curries"),
    makeItem("Prawn Masala", "Juicy prawns cooked in a fiery onion-tomato coconut masala", 480, false, "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400", "indian-mains---curries"),
    makeItem("Dal Makhani", "Black lentils slow-simmered overnight with butter and cream", 300, true, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", "indian-mains---curries"),
  ],
  "biryanis-&-rice": [
    makeItem("Chicken Dum Biryani", "Slow-cooked aromatic basmati rice with tender chicken and saffron", 420, false, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400", "biryanis-&-rice"),
    makeItem("Mutton Biryani", "Succulent mutton pieces layered with fragrant long-grain rice and fried onions", 480, false, "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400", "biryanis-&-rice"),
    makeItem("Veg Pulao", "Basmati rice cooked with mixed vegetables, whole spices and ghee", 280, true, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", "biryanis-&-rice"),
    makeItem("Prawn Biryani", "Fragrant biryani layered with spiced prawns and caramelised onions", 520, false, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400", "biryanis-&-rice"),
    makeItem("Veg Dum Biryani", "Seasonal vegetables layered with aromatic rice and caramelised onions", 340, true, "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400", "biryanis-&-rice"),
  ],
  "dals": [
    makeItem("Dal Tadka", "Yellow lentils tempered with cumin, garlic, dried red chillies and ghee", 220, true, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", "dals"),
    makeItem("Dal Makhani", "Slow-cooked black lentils simmered overnight with butter and cream", 260, true, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", "dals"),
    makeItem("Panchmel Dal", "Five lentil medley cooked with Rajasthani spices and ghee", 240, true, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", "dals"),
    makeItem("Chana Masala", "Chickpeas in a spiced onion-tomato gravy with amchur", 230, true, "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400", "dals"),
    makeItem("Moong Dal", "Light split green gram cooked with turmeric and topped with ghee tempering", 200, true, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", "dals"),
  ],
  "breads": [
    makeItem("Butter Naan", "Soft leavened Indian bread brushed with butter, baked in a tandoor", 60, true, "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400", "breads"),
    makeItem("Garlic Naan", "Naan topped with minced garlic and fresh coriander", 80, true, "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", "breads"),
    makeItem("Laccha Paratha", "Flaky whole wheat layered flatbread cooked with ghee", 70, true, "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400", "breads"),
    makeItem("Stuffed Kulcha", "Soft bread stuffed with spiced potato and onion filling", 100, true, "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", "breads"),
    makeItem("Tandoori Roti", "Whole wheat bread baked fresh in the clay oven", 50, true, "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400", "breads"),
  ],
  "asian-mains": [
    makeItem("Thai Green Curry", "Coconut milk curry with vegetables in aromatic green curry paste", 360, true, "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400", "asian-mains"),
    makeItem("Chicken Pad Thai", "Classic Thai stir-fried rice noodles with chicken, bean sprouts and peanuts", 380, false, "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400", "asian-mains"),
    makeItem("Beef Rendang", "Slow-cooked Indonesian beef in a rich coconut and lemongrass sauce", 480, false, "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400", "asian-mains"),
    makeItem("Miso Glazed Eggplant", "Japanese-style eggplant caramelised with sweet miso glaze", 280, true, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", "asian-mains"),
    makeItem("Katsu Curry", "Crispy breaded chicken on steamed rice with Japanese curry sauce", 440, false, "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", "asian-mains"),
  ],
  "rice-with-curry---thai-&-asian-bowls": [
    makeItem("Thai Basil Chicken Bowl", "Stir-fried chicken with Thai basil over jasmine rice, topped with a fried egg", 360, false, "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400", "rice-with-curry---thai-&-asian-bowls"),
    makeItem("Red Curry Tofu Bowl", "Creamy red curry with tofu and vegetables served over steamed rice", 320, true, "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400", "rice-with-curry---thai-&-asian-bowls"),
    makeItem("Teriyaki Salmon Bowl", "Grilled teriyaki salmon over Japanese rice with pickled vegetables", 480, false, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", "rice-with-curry---thai-&-asian-bowls"),
    makeItem("Vietnamese Pork Bowl", "Marinated pork with rice noodles, fresh herbs and nuoc cham dressing", 400, false, "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=400", "rice-with-curry---thai-&-asian-bowls"),
    makeItem("Korean Bibimbap", "Mixed rice bowl with vegetables, pickled kimchi, gochujang and fried egg", 350, true, "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400", "rice-with-curry---thai-&-asian-bowls"),
  ],
  "rice-&-noodles": [
    makeItem("Egg Fried Rice", "Classic Chinese-style egg fried rice with vegetables and soy sauce", 220, true, "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", "rice-&-noodles"),
    makeItem("Chicken Hakka Noodles", "Wok-tossed noodles with chicken and vegetables in soy sauce", 280, false, "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400", "rice-&-noodles"),
    makeItem("Veg Schezwan Noodles", "Spicy Schezwan-style noodles tossed with colourful vegetables", 250, true, "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400", "rice-&-noodles"),
    makeItem("Prawn Fried Rice", "Wok-fried rice with prawns, egg and spring onions", 340, false, "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", "rice-&-noodles"),
    makeItem("Ramen Noodle Soup", "Japanese-style ramen in a rich tonkotsu broth with soft-boiled egg", 380, false, "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400", "rice-&-noodles"),
  ],
  "desserts": [
    makeItem("Chocolate Lava Cake", "Warm dark chocolate cake with a molten gooey centre and vanilla ice cream", 280, true, "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", "desserts"),
    makeItem("Gulab Jamun (3 pcs)", "Soft milk solid dumplings soaked in rose-flavoured sugar syrup", 180, true, "https://images.unsplash.com/photo-1601303516534-bf4bfba10d34?w=400", "desserts"),
    makeItem("Tiramisu", "Italian coffee-soaked ladyfingers layered with mascarpone cream", 320, true, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400", "desserts"),
    makeItem("Mango Pannacotta", "Silky Italian cream dessert with fresh Alphonso mango coulis", 260, true, "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", "desserts"),
    makeItem("Kulfi Falooda", "Traditional Indian ice cream with vermicelli noodles and rose syrup", 220, true, "https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?w=400", "desserts"),
  ],
  "sizzlers": [
    makeItem("Veg Sizzler", "Assorted vegetables, rice and cottage cheese served on a sizzling platter", 380, true, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", "sizzlers"),
    makeItem("Chicken Sizzler", "Grilled chicken steak with vegetables and garlic bread on a hot plate", 480, false, "https://images.unsplash.com/photo-1598103442097-8b74394b95c8?w=400", "sizzlers"),
    makeItem("Prawn Sizzler", "Sautéed prawns with stir-fried vegetables and fried rice on a sizzling cast iron", 560, false, "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400", "sizzlers"),
    makeItem("Mutton Sizzler", "Tender mutton cutlets with roasted vegetables and chips on a sizzler plate", 580, false, "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400", "sizzlers"),
    makeItem("Paneer Sizzler", "Grilled paneer steak with vegetables and herbed rice on a sizzling plate", 420, true, "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400", "sizzlers"),
  ],
  // Bar categories - prices as strings
  "blended-whisky": [
    makeItem("Royal Stag", "A smooth Indian blended whisky with hints of vanilla and oak", "30ml: ₹180 / 60ml: ₹340 / Bottle: ₹2200", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "blended-whisky"),
    makeItem("Officer's Choice", "India's popular blended whisky with a light, easy-drinking character", "30ml: ₹150 / 60ml: ₹280 / Bottle: ₹1800", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "blended-whisky"),
    makeItem("Imperial Blue", "Smooth and mellow blended whisky with subtle citrus notes", "30ml: ₹170 / 60ml: ₹320 / Bottle: ₹2000", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "blended-whisky"),
    makeItem("8 PM", "A classic affordable Indian blended whisky with a smooth finish", "30ml: ₹140 / 60ml: ₹260 / Bottle: ₹1600", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "blended-whisky"),
  ],
  "blended-scotch-whisky": [
    makeItem("Johnnie Walker Black Label", "Aged 12 years, with rich, dark fruit and smoky notes", "30ml: ₹350 / 60ml: ₹650 / Bottle: ₹5500", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "blended-scotch-whisky"),
    makeItem("Chivas Regal 12 Year", "Smooth and rich Scotch with honey, hazelnut and apple flavours", "30ml: ₹380 / 60ml: ₹700 / Bottle: ₹5800", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "blended-scotch-whisky"),
    makeItem("Ballantine's Finest", "A light, floral Scotch blended for easy sipping", "30ml: ₹300 / 60ml: ₹560 / Bottle: ₹4500", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "blended-scotch-whisky"),
    makeItem("Famous Grouse", "Scotland's favourite blend — smooth with a fruity, rich finish", "30ml: ₹280 / 60ml: ₹520 / Bottle: ₹4200", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "blended-scotch-whisky"),
  ],
  "american-irish-whiskey": [
    makeItem("Jack Daniel's Old No. 7", "Tennessee whiskey mellowed through charcoal with sweet vanilla notes", "30ml: ₹320 / 60ml: ₹600 / Bottle: ₹5200", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "american-irish-whiskey"),
    makeItem("Jameson Irish Whiskey", "Triple-distilled smooth Irish whiskey with nutty and vanilla character", "30ml: ₹340 / 60ml: ₹640 / Bottle: ₹5400", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "american-irish-whiskey"),
    makeItem("Jim Beam Bourbon", "America's classic bourbon with caramel, vanilla and oak undertones", "30ml: ₹290 / 60ml: ₹550 / Bottle: ₹4600", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "american-irish-whiskey"),
    makeItem("Maker's Mark", "Small-batch Kentucky bourbon with a soft, sweet and spicy palate", "30ml: ₹380 / 60ml: ₹720 / Bottle: ₹6000", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "american-irish-whiskey"),
  ],
  "single-malt-whisky": [
    makeItem("Glenfiddich 12 Year", "World's most awarded single malt — fresh and fruity with pear notes", "30ml: ₹480 / 60ml: ₹900 / Bottle: ₹7500", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "single-malt-whisky"),
    makeItem("Glenlivet 12 Year", "Smooth Speyside malt with floral notes and hints of vanilla", "30ml: ₹460 / 60ml: ₹860 / Bottle: ₹7200", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "single-malt-whisky"),
    makeItem("Laphroaig 10 Year", "Intensely peaty Islay malt with a smoky, medicinal and maritime character", "30ml: ₹520 / 60ml: ₹980 / Bottle: ₹8200", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "single-malt-whisky"),
    makeItem("Macallan 12 Year Sherry", "Rich sherried single malt with dried fruit, spice and chocolate notes", "30ml: ₹580 / 60ml: ₹1100 / Bottle: ₹9000", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "single-malt-whisky"),
  ],
  "vodka": [
    makeItem("Absolut Original", "Clean, smooth Swedish vodka with a grain-forward character", "30ml: ₹260 / 60ml: ₹480 / Bottle: ₹4000", false, "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", "vodka"),
    makeItem("Grey Goose", "Premium French vodka made from winter wheat — silky and smooth", "30ml: ₹420 / 60ml: ₹790 / Bottle: ₹6500", false, "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", "vodka"),
    makeItem("Belvedere", "Polish rye vodka with a full-bodied creamy texture", "30ml: ₹400 / 60ml: ₹760 / Bottle: ₹6200", false, "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", "vodka"),
    makeItem("Smirnoff No. 21", "Classic triple-distilled vodka with a clean, crisp finish", "30ml: ₹220 / 60ml: ₹400 / Bottle: ₹3200", false, "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", "vodka"),
  ],
  "gin": [
    makeItem("Bombay Sapphire", "Complex London Dry gin with 10 exotic botanicals", "30ml: ₹280 / 60ml: ₹530 / Bottle: ₹4400", false, "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400", "gin"),
    makeItem("Hendrick's Gin", "Scottish gin infused with rose and cucumber — floral and refreshing", "30ml: ₹380 / 60ml: ₹720 / Bottle: ₹6000", false, "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400", "gin"),
    makeItem("Tanqueray No. TEN", "Citrus-forward London Dry gin made with fresh fruits", "30ml: ₹350 / 60ml: ₹660 / Bottle: ₹5500", false, "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400", "gin"),
    makeItem("Gordon's Gin", "Britain's original London Dry gin, crisp and juniper-forward", "30ml: ₹240 / 60ml: ₹450 / Bottle: ₹3800", false, "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400", "gin"),
  ],
  "rum": [
    makeItem("Bacardi White Rum", "Light Cuban-style white rum, clean and versatile for cocktails", "30ml: ₹220 / 60ml: ₹400 / Bottle: ₹3200", false, "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=400", "rum"),
    makeItem("Captain Morgan Spiced Gold", "Caribbean spiced rum with vanilla, cinnamon and tropical flavours", "30ml: ₹250 / 60ml: ₹470 / Bottle: ₹3800", false, "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=400", "rum"),
    makeItem("Ron Zacapa 23 Year", "Guatemalan aged rum with rich notes of honey, chocolate and vanilla", "30ml: ₹480 / 60ml: ₹900 / Bottle: ₹7500", false, "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=400", "rum"),
    makeItem("Old Monk Dark Rum", "India's iconic dark rum with a rich, sweet and woody character", "30ml: ₹160 / 60ml: ₹300 / Bottle: ₹2400", false, "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=400", "rum"),
  ],
  "tequila": [
    makeItem("Jose Cuervo Silver", "Smooth silver tequila made from blue agave, perfect for shots and cocktails", "30ml: ₹280 / 60ml: ₹520 / Bottle: ₹4400", false, "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400", "tequila"),
    makeItem("Patrón Silver", "Ultra-premium handcrafted tequila — silky smooth with citrus and pepper", "30ml: ₹480 / 60ml: ₹900 / Bottle: ₹7500", false, "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400", "tequila"),
    makeItem("Don Julio Blanco", "Award-winning agave tequila with bright citrus and light pepper notes", "30ml: ₹450 / 60ml: ₹850 / Bottle: ₹7000", false, "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400", "tequila"),
    makeItem("1800 Reposado", "Aged in American oak with vanilla, caramel and agave character", "30ml: ₹360 / 60ml: ₹680 / Bottle: ₹5600", false, "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400", "tequila"),
  ],
  "cognac-brandy": [
    makeItem("Hennessy VS", "World's most recognised cognac — fruity with toasty oak notes", "30ml: ₹420 / 60ml: ₹790 / Bottle: ₹6500", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "cognac-brandy"),
    makeItem("Rémy Martin VSOP", "Fine Champagne cognac with rich, round flavours of plum and vanilla", "30ml: ₹480 / 60ml: ₹900 / Bottle: ₹7500", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "cognac-brandy"),
    makeItem("Martell VS Single Distillery", "Smooth single distillery cognac with gentle fruit and floral notes", "30ml: ₹380 / 60ml: ₹720 / Bottle: ₹6000", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "cognac-brandy"),
    makeItem("Courvoisier VS", "Classic Napoleon-style cognac with sweet grape and oak balance", "30ml: ₹400 / 60ml: ₹760 / Bottle: ₹6200", false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "cognac-brandy"),
  ],
  "liqueurs": [
    makeItem("Baileys Irish Cream", "Smooth blend of Irish whiskey and cream with chocolate undertones", "30ml: ₹240 / 60ml: ₹440 / Bottle: ₹3600", false, "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", "liqueurs"),
    makeItem("Kahlúa Coffee Liqueur", "Mexican coffee liqueur with sweet rum and vanilla character", "30ml: ₹220 / 60ml: ₹410 / Bottle: ₹3400", false, "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", "liqueurs"),
    makeItem("Cointreau", "Premium orange triple sec liqueur essential for cocktails", "30ml: ₹280 / 60ml: ₹520 / Bottle: ₹4400", false, "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", "liqueurs"),
    makeItem("Amaretto Disaronno", "Italian almond-flavoured liqueur with sweet marzipan notes", "30ml: ₹260 / 60ml: ₹490 / Bottle: ₹4000", false, "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", "liqueurs"),
  ],
  "sparkling-wine": [
    makeItem("Prosecco DOC Brut", "Italian sparkling wine with light bubbles and crisp pear flavours", "Glass: ₹480 / Bottle: ₹2800", false, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", "sparkling-wine"),
    makeItem("Moët & Chandon Brut", "Iconic French Champagne with biscuit and citrus notes", "Glass: ₹980 / Bottle: ₹5800", false, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", "sparkling-wine"),
    makeItem("Sula Brut NV", "Indian sparkling wine — light, refreshing and crisp with fine bubbles", "Glass: ₹360 / Bottle: ₹2200", false, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", "sparkling-wine"),
    makeItem("Freixenet Cava Brut", "Spanish cava with fresh apple and lemon zest character", "Glass: ₹420 / Bottle: ₹2500", false, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", "sparkling-wine"),
  ],
  "white-wines": [
    makeItem("Sauvignon Blanc", "Crisp New Zealand white wine with gooseberry and citrus flavours", "Glass: ₹420 / Bottle: ₹2500", false, "https://images.unsplash.com/photo-1474722883778-792e7fb1c09d?w=400", "white-wines"),
    makeItem("Chardonnay", "Full-bodied California Chardonnay with buttery oak and tropical fruit", "Glass: ₹440 / Bottle: ₹2600", false, "https://images.unsplash.com/photo-1474722883778-792e7fb1c09d?w=400", "white-wines"),
    makeItem("Pinot Grigio", "Light Italian white with fresh peach and almond notes", "Glass: ₹400 / Bottle: ₹2400", false, "https://images.unsplash.com/photo-1474722883778-792e7fb1c09d?w=400", "white-wines"),
    makeItem("Riesling", "German off-dry white with vibrant apple, peach and mineral notes", "Glass: ₹460 / Bottle: ₹2700", false, "https://images.unsplash.com/photo-1474722883778-792e7fb1c09d?w=400", "white-wines"),
  ],
  "rose-wines": [
    makeItem("Whispering Angel Rosé", "Famous Provençal rosé — delicate, pale and dry with red berry notes", "Glass: ₹580 / Bottle: ₹3400", false, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", "rose-wines"),
    makeItem("Zinfandel Rosé", "American blush rosé with a hint of sweetness and strawberry flavours", "Glass: ₹380 / Bottle: ₹2200", false, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", "rose-wines"),
    makeItem("Sula Rosé", "Indian rosé made from Shiraz grapes — light and fruity", "Glass: ₹320 / Bottle: ₹1900", false, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", "rose-wines"),
  ],
  "red-wines": [
    makeItem("Cabernet Sauvignon", "Bold Napa Valley red with blackcurrant, cedar and firm tannins", "Glass: ₹480 / Bottle: ₹2800", false, "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400", "red-wines"),
    makeItem("Shiraz", "Robust Australian Shiraz with dark berries, pepper and smoky oak", "Glass: ₹460 / Bottle: ₹2700", false, "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400", "red-wines"),
    makeItem("Merlot", "Smooth and plummy French Merlot with velvety texture and soft tannins", "Glass: ₹440 / Bottle: ₹2600", false, "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400", "red-wines"),
    makeItem("Malbec", "Rich Argentine Malbec with dark plum, cocoa and vanilla notes", "Glass: ₹470 / Bottle: ₹2750", false, "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400", "red-wines"),
  ],
  "dessert-wines": [
    makeItem("Sauternes", "Classic French sweet wine from Bordeaux — honeyed, apricot and botrytis", "Glass: ₹680 / Bottle: ₹4000", false, "https://images.unsplash.com/photo-1474722883778-792e7fb1c09d?w=400", "dessert-wines"),
    makeItem("Moscato d'Asti", "Lightly sparkling Italian sweet wine with peach and apricot aromas", "Glass: ₹480 / Bottle: ₹2800", false, "https://images.unsplash.com/photo-1474722883778-792e7fb1c09d?w=400", "dessert-wines"),
    makeItem("Late Harvest Riesling", "German dessert wine with intense honeyed sweetness and vibrant acidity", "Glass: ₹580 / Bottle: ₹3400", false, "https://images.unsplash.com/photo-1474722883778-792e7fb1c09d?w=400", "dessert-wines"),
  ],
  "port-wine": [
    makeItem("Graham's Late Bottled Vintage", "Rich, full-bodied port with dark fruit, chocolate and spice character", "Glass: ₹480 / Bottle: ₹2800", false, "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400", "port-wine"),
    makeItem("Taylor Fladgate Tawny 10 Year", "Nutty, caramel-rich tawny port aged in small oak casks", "Glass: ₹520 / Bottle: ₹3000", false, "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400", "port-wine"),
    makeItem("Sandeman Founders Reserve", "Classic ruby port with vibrant red fruit and gentle sweetness", "Glass: ₹420 / Bottle: ₹2400", false, "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400", "port-wine"),
  ],
  "signature-mocktails": [
    makeItem("Barrelborn Sunrise", "Fresh orange juice, grenadine and sparkling water with citrus garnish", 180, true, "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400", "signature-mocktails"),
    makeItem("Virgin Mojito", "Fresh lime, mint, sugar and soda water over crushed ice", 160, true, "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400", "signature-mocktails"),
    makeItem("Mango Tango", "Alphonso mango purée blended with lime juice and a hint of chilli", 200, true, "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400", "signature-mocktails"),
    makeItem("Blue Lagoon", "Blue curacao syrup with lemonade and a splash of grenadine", 190, true, "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", "signature-mocktails"),
    makeItem("Watermelon Cooler", "Fresh watermelon juice with mint, lime and sparkling water", 175, true, "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400", "signature-mocktails"),
  ],
  "soft-beverages": [
    makeItem("Coca-Cola", "Ice-cold classic Coca-Cola served with ice and lemon", 80, true, "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400", "soft-beverages"),
    makeItem("Fresh Lime Soda", "Freshly squeezed lime with soda water — sweet, salty or both", 90, true, "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400", "soft-beverages"),
    makeItem("Red Bull", "Energy drink with caffeine, taurine and B-vitamins", 160, true, "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400", "soft-beverages"),
    makeItem("Tonic Water", "Schweppes premium tonic water with natural quinine", 100, true, "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", "soft-beverages"),
    makeItem("Cold Coffee", "Blended iced coffee with milk and sugar, served chilled", 140, true, "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400", "soft-beverages"),
  ],
  "craft-beers-on-tap": [
    makeItem("Barrelborn Pale Ale", "Our house pale ale — golden, hoppy and refreshingly bitter", "Pint: ₹320 / Half Pint: ₹180", false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "craft-beers-on-tap"),
    makeItem("Witbier", "Belgian-style wheat beer with orange peel and coriander", "Pint: ₹340 / Half Pint: ₹190", false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "craft-beers-on-tap"),
    makeItem("Oatmeal Stout", "Dark, creamy stout with roasted coffee and chocolate notes", "Pint: ₹360 / Half Pint: ₹200", false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "craft-beers-on-tap"),
    makeItem("IPA — Mosaic Hop", "West Coast IPA bursting with tropical and citrus hop aromas", "Pint: ₹380 / Half Pint: ₹210", false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "craft-beers-on-tap"),
  ],
  "draught-beer": [
    makeItem("Kingfisher Premium Draught", "India's most popular lager on tap — crisp and refreshing", "Pint: ₹260 / Half Pint: ₹150", false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "draught-beer"),
    makeItem("Heineken Draught", "Dutch premium lager with a clean bitter finish, served ice cold", "Pint: ₹300 / Half Pint: ₹170", false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "draught-beer"),
    makeItem("Budweiser Draught", "Classic American lager on tap, light and crisp", "Pint: ₹280 / Half Pint: ₹160", false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "draught-beer"),
  ],
  "pint-beers": [
    makeItem("Corona Extra", "Mexican lager served with lime — light and refreshing", 280, false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "pint-beers"),
    makeItem("Stella Artois", "Premium Belgian pilsner with a clean, crisp and hoppy finish", 300, false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "pint-beers"),
    makeItem("Hoegaarden", "Belgian white beer with a hint of orange peel and coriander", 320, false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "pint-beers"),
    makeItem("Kingfisher Strong", "India's bold strong lager with extra kick", 220, false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "pint-beers"),
  ],
  "classic-cocktails": [
    makeItem("Old Fashioned", "Bourbon, Angostura bitters, sugar and orange zest over a large ice sphere", 480, false, "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400", "classic-cocktails"),
    makeItem("Negroni", "Equal parts gin, Campari and sweet vermouth — bitter and beautiful", 460, false, "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400", "classic-cocktails"),
    makeItem("Whisky Sour", "Bourbon shaken with fresh lemon juice and sugar, served with egg white foam", 440, false, "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400", "classic-cocktails"),
    makeItem("Mojito", "White rum, fresh mint, lime, sugar and soda — the Cuban classic", 380, false, "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", "classic-cocktails"),
    makeItem("Margarita", "Tequila, Cointreau and fresh lime juice served in a salt-rimmed glass", 420, false, "https://images.unsplash.com/photo-1570598912132-0ba1dc952b7d?w=400", "classic-cocktails"),
  ],
  "signature-cocktails": [
    makeItem("Barrel Smash", "Bourbon, fresh lemon, mint and honey with a splash of ginger beer", 520, false, "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400", "signature-cocktails"),
    makeItem("Draft Night Special", "Dark rum, coffee liqueur, cold brew and Angostura bitters", 500, false, "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", "signature-cocktails"),
    makeItem("Smoky Mango Mezcal", "Mezcal, mango juice, chilli and lime with a smoky tajín rim", 540, false, "https://images.unsplash.com/photo-1570598912132-0ba1dc952b7d?w=400", "signature-cocktails"),
    makeItem("Garden Sling", "Gin, elderflower, cucumber and tonic water over ice", 480, false, "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400", "signature-cocktails"),
    makeItem("Spiced Rum Fizz", "Dark rum, spiced syrup, lime and sparkling water", 460, false, "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=400", "signature-cocktails"),
  ],
  "wine-cocktails": [
    makeItem("Aperol Spritz", "Aperol, Prosecco, soda and an orange slice — the Italian classic", 420, false, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", "wine-cocktails"),
    makeItem("Red Wine Sangria", "House red wine with brandy, orange juice and seasonal fruit", 380, false, "https://images.unsplash.com/photo-1570598912132-0ba1dc952b7d?w=400", "wine-cocktails"),
    makeItem("Kir Royale", "Champagne topped with a splash of blackcurrant crème de cassis", 480, false, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", "wine-cocktails"),
    makeItem("Rosé Lemonade", "Rosé wine mixed with homemade lemonade and fresh berries", 360, false, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", "wine-cocktails"),
  ],
  "sangria": [
    makeItem("Classic Red Sangria (Jug)", "House red wine, brandy, orange juice and mixed fruit — serves 2-3", 680, false, "https://images.unsplash.com/photo-1570598912132-0ba1dc952b7d?w=400", "sangria"),
    makeItem("White Sangria (Jug)", "Crisp white wine, elderflower and peach slices — serves 2-3", 720, false, "https://images.unsplash.com/photo-1474722883778-792e7fb1c09d?w=400", "sangria"),
    makeItem("Rosé Sangria (Jug)", "Rosé wine with strawberries, mint and lemon — serves 2-3", 700, false, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", "sangria"),
  ],
  "beer-cocktail": [
    makeItem("Michelada", "Lager mixed with lime juice, salt, Worcestershire and hot sauce", 320, false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "beer-cocktail"),
    makeItem("Beer Mojito", "Light lager blended with fresh mint, lime and a hint of rum", 340, false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "beer-cocktail"),
    makeItem("Shandy", "Cold draught beer mixed with chilled ginger beer for a refreshing sip", 260, false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "beer-cocktail"),
    makeItem("Chelada", "Mexican-style beer with lime juice, salt and chilli rim", 300, false, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400", "beer-cocktail"),
  ],
  "signature-shots": [
    makeItem("Tequila Slammer", "Patron Silver tequila with a salted rim and lime wedge", 260, false, "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400", "signature-shots"),
    makeItem("Jägerbomb", "Jägermeister dropped into a glass of Red Bull", 320, false, "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400", "signature-shots"),
    makeItem("B-52", "Layered shot of Kahlúa, Baileys and Grand Marnier", 300, false, "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", "signature-shots"),
    makeItem("Fireball", "Whisky blended with hot cinnamon flavours", 280, false, "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400", "signature-shots"),
    makeItem("Espresso Shot", "Vodka, Kahlúa and a fresh espresso shot — the ultimate pick-me-up", 340, false, "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400", "signature-shots"),
  ],
};

async function seed() {
  try {
    await client.connect();
    const db = client.db("barrelborn");
    console.log("Connected to MongoDB");

    let totalInserted = 0;
    for (const [category, items] of Object.entries(seedData)) {
      const collection = db.collection(category);
      const existing = await collection.countDocuments();
      if (existing > 0) {
        console.log(`⚠️  Skipping '${category}' — already has ${existing} items`);
        continue;
      }
      const result = await collection.insertMany(items as any[]);
      console.log(`✅  Inserted ${result.insertedCount} items into '${category}'`);
      totalInserted += result.insertedCount;
    }

    console.log(`\n🎉 Done! Total items inserted: ${totalInserted}`);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
