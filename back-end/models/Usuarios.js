import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Define o modelo Usuarios
const Usuario = sequelize.define('Usuario', {  // define um modelo('nome da tabela) { campos da tabela...}
    codigo_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cep: {
        type: DataTypes.STRING(8)
    },
    estado: {
        type: DataTypes.STRING(2)
    },
}, {
    tableName: 'usuarios'
})


export { Usuario };