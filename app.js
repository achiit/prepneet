const express = require('express');
const app = express();
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');

// Connect to the database
sequelize
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((error) => console.error('Unable to connect to the database:', error));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
