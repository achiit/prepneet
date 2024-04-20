const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('neetprep', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // Use 'mysql' dialect for MySQL database
  port: 3306, // MySQL default port
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
