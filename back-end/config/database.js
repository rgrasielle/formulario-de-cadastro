import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('cadastro', 'postgres', 'p@ssw0rd', {
    host: 'localhost',
    dialect: 'postgres'
})

export default sequelize;

