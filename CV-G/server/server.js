const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
// const mongoose = require('mongoose') // ⛔ Comment this out for now

dotenv.config()
const app = express()

const sequelize = require('./sequelize');
const { User } = require('./models/User');

sequelize.sync({ alter: true })  // Use `force: true` only for development to DROP and recreate tables
  .then(() => console.log('✅ MySQL synced with Sequelize'))
  .catch(err => console.error('❌ Sync error:', err));


app.use(cors())
app.use(express.json())

// Routes
const authRoutes = require('./routes/auth') // keep or comment if unused
const generateRoutes = require('./routes/generate')

// app.use('/api/auth', authRoutes) // optional
app.use('/api/generate', generateRoutes)

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
