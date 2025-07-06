const { Sequelize } = require('sequelize')
require('dotenv').config()

const { BE_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env || 5000;
console.log(BE_PORT);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);
exports.sequelize = sequelize

const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Connection to MySQL has been established successfully.');
  } catch (error) {
    console.error(' Unable to connect to the database:', error);
  }
}
connectDb()

