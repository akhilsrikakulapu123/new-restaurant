const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiPrefix = '/api';
app.use(`${apiPrefix}/foods`, require('./routes/foods'));
app.use(`${apiPrefix}/feedback`, require('./routes/feedback'));
app.use(`${apiPrefix}/checkout`, require('./routes/checkout'));
app.use(`${apiPrefix}/recipes`, require('./routes/recipes'));

const staticRoot = path.join(__dirname, '..');
app.use(express.static(staticRoot));

app.get('/', (req, res) => {
  res.sendFile(path.join(staticRoot, 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://akhilsrikakulapu2005_db_user:0QJmH7Ab83vFg3WU@cluster0.y6zhekn.mongodb.net/madhuri_restaurant';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    seedFoods().then(() => seedRecipes()).catch(err => console.error(err));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const Food = require('./models/Food');
const defaultFoods = [
  { name: 'Idli Sambhar', price: 'Rs.70', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2015/12/poha-idli-recipe-280x280.jpg', cuisine: 'South Indian' },
  { name: 'Masala Dosa', price: 'Rs.80', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/06/masala-dosa-recipe-1-280x280.jpg', cuisine: 'South Indian' },
  { name: 'Upma', price: 'Rs.30', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2009/08/upma-recipe-1-280x280.jpg', cuisine: 'South Indian' },
  { name: 'Pav Bhaji', price: 'Rs.80', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/04/pav-bhaji-1-280x280.jpg', cuisine: 'Maharashtrian' },
  { name: 'Rasam', price: 'Rs.180', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2014/02/rasam-recipe-1-280x280.jpg', cuisine: 'South Indian' },
  { name: 'Mango Rice', price: 'Rs.75', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2015/04/raw-mango-rice-recipe-280x280.jpg', cuisine: 'South Indian' },
  { name: 'Paneer', price: 'Rs.125', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2017/06/matar-paneer-dhaba-style-recipe-280x280.jpg', cuisine: 'Punjabi' },
  { name: 'Pot Dal Makhani', price: 'Rs.75', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2009/08/instant-pot-dal-makhani-280x280.jpg', cuisine: 'Punjabi' },
  { name: 'Dahi Bhalla', price: 'Rs.55', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2015/11/dahi-bhalla-recipe-280x280.jpg', cuisine: 'Punjabi' },
  { name: 'Aloo Kofta', price: 'Rs.75', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2015/08/aloo-kofta-gravy-recipe-280x280.jpg', cuisine: 'Punjabi' },
  { name: 'Peas Pulao', price: 'Rs.95', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/01/peas-pulao-recipe-280x280.jpg', cuisine: 'Punjabi' },
  { name: 'Lassi', price: 'Rs.45', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/04/lassi-recipe-1-280x280.jpg', cuisine: 'Punjabi' },
  { name: 'Sabudana Vada', price: 'Rs.35', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/05/sabudana-vada-recipe-3-280x280.jpg', cuisine: 'Maharashtrian' },
  { name: 'Chakli', price: 'Rs.60', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2014/10/chakli-3-280x280.jpg', cuisine: 'Maharashtrian' },
  { name: 'Rice Puri', price: 'Rs.55', image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2014/07/rice-pooris-recipe-280x280.jpg', cuisine: 'Maharashtrian' }
];

async function seedFoods() {
  try {
    const count = await Food.countDocuments();
    if (count === 0) {
      await Food.insertMany(defaultFoods);
      console.log('Seeded default food items');
    }
  } catch (error) {
    console.error('Error seeding food items:', error);
  }
}

// seed simple recipes for seeded foods (won't overwrite existing recipes)
const Recipe = require('./models/Recipe');
async function seedRecipes() {
  try {
    const defaultMap = {
      'Idli Sambhar': `Idli with sambhar: Soak 2 cups rice and 1 cup urad dal separately for 4–6 hours. Grind to a smooth batter, mix and ferment overnight. Steam small idlis for 10–12 minutes. Prepare sambhar by cooking toor dal until soft, temper mustard seeds, curry leaves, and add vegetables and sambhar powder. Serve idlis hot with sambhar and coconut chutney.`,
      'Masala Dosa': `Prepare dosa batter a day ahead. For masala, sauté boiled potatoes with mustard seeds, curry leaves, onions, green chilies and turmeric. Add salt and lemon. Spread dosa batter thin on a hot pan, cook until crisp, place potato masala inside and fold. Serve with chutney and sambhar.`,
      'Upma': `Roast 1 cup semolina lightly. In a pan, heat oil, add mustard seeds, urad dal, chana dal, curry leaves, green chilies and chopped onions. Add vegetables if desired, then pour boiling water, add salt and slowly add semolina while stirring to avoid lumps. Cook until fluffy.`,
      'Pav Bhaji': `Boil potatoes, peas, cauliflower and carrots. Mash together and sauté with butter, onions, garlic, and pav bhaji masala. Add tomato puree, cook till thick. Toast pav with butter and serve with chopped onions and lemon.`,
      'Rasam': `Cook tamarind extract with toor dal broth, add tomatoes, rasam powder, turmeric and salt. Temper mustard seeds, curry leaves and crushed garlic in ghee and pour into rasam. Garnish with coriander and serve hot.`,
      'Mango Rice': `Cook rice and let cool. In a pan, heat oil and add mustard seeds, curry leaves, peanuts and green chilies. Add grated raw mango, turmeric and salt. Mix in rice, garnish with coriander and serve warm or cold.`,
      'Paneer': `For a simple paneer curry, cube paneer and shallow fry. Sauté onions, ginger-garlic, add tomato puree and spices (garam masala, coriander, turmeric). Add paneer cubes and simmer in creamy gravy. Garnish with kasuri methi.`,
      'Pot Dal Makhani': `Soak whole urad and rajma overnight. Pressure cook with water and salt. Sauté butter, onions, ginger-garlic, add tomato puree and simmer. Add cooked dal, cream, kasuri methi and cook on low until rich and creamy.`,
      'Dahi Bhalla': `Soak urad dal, grind to a coarse batter, whisk and make small vadas. Deep fry until golden and then soak in warm water. Serve topped with whisked yogurt, tamarind and mint chutneys, chaat masala and chopped coriander.`,
      'Aloo Kofta': `Boil and mash potatoes. Mix with spices, chopped herbs and a little gram flour, shape into balls and deep fry until golden. Prepare a spiced tomato-onion gravy and simmer the koftas in the gravy before serving.`,
      'Peas Pulao': `Sauté whole spices, add basmati rice, green peas and water. Cook until rice is fluffy. Finish with ghee and garnish with fried onions and coriander.`,
      'Lassi': `Blend chilled yogurt with sugar (or salt for salty lassi) and a little water until frothy. Add cardamom or mango pulp for flavored variations. Serve chilled.`,
      'Sabudana Vada': `Soak sabudana (tapioca pearls) for a few hours. Mix with boiled mashed potato, roasted peanuts, green chilies and salt. Shape into patties and deep fry until crisp. Serve with green chutney.`,
      'Chakli': `Chakli is a deep fried savory snack made from rice flour and gram flour. Mix flours with spices, shape into spirals and deep fry until crisp.`,
      'Rice Puri': `Make a dough using rice flour, knead with warm water. Roll small discs and deep fry until puffed and golden. Serve with potato curry or sweet chutney.`
    };

    const foods = await Food.find();
    for (const f of foods) {
      const existing = await Recipe.findOne({ foodId: f._id });
      if (existing) continue;
      const content = defaultMap[f.name] || `No recipe available for ${f.name}.`;
      await Recipe.create({ foodId: f._id, content });
    }
    console.log('Seeded default recipes (missing only)');
  } catch (err) {
    console.error('Error seeding recipes:', err);
  }
}

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
