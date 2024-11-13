import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Usuario } from './Usuarios.js';

const Telefone = sequelize.define('Telefone', {
    numero: {
        type: DataTypes.CHAR(15),
        allowNull: false,
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: 'codigo_usuario'
        }
    }
});


// Sincroniza os modelos
sequelize.sync({ force: false });

export { Telefone };