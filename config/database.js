const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://koyeb-adm:2vpMiaUo0PZQ@ep-sparkling-hall-a2tgjqmz.eu-central-1.pg.koyeb.app/koyebdb', {

  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
    console.log("Unable to connect to database");
  });

module.exports = sequelize;
