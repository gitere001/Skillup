import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
	dialect: 'postgres',
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	logging: false,
  });

  (async () => {
	try {
		await sequelize.authenticate()
		console.log('Connected to pstgreSQl database')
	} catch (error) {
		console.error('Unable to connect to pstgreSQl database')
	}
  })()

export default sequelize;