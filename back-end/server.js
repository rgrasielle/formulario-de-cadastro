import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js'
import { Usuario } from './models/Usuarios.js';
import { Telefone } from './models/Telefone.js';

const app = express();

app.use(express.json())
app.use(cors())

// Defina as associações
Usuario.hasMany(Telefone, { foreignKey: 'usuarioId' });
Telefone.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Sincroniza os modelos com o banco de dados
sequelize.sync({ force: false });

// Rota para CRIAR um novo usuário
app.post('/usuarios', async (req, res) => {
    const { name, password, cep, uf, phones } = req.body; // Extrai os campos do request
    try {
        // Cria o usuário
        const novoUsuario = await Usuario.create({
            usuario: name,
            senha: password,
            cep: cep,
            estado: uf
        });

        // Cria os telefones associados
        if (phones && phones.length > 0) {
            const telefones = phones.map(phone => ({ numero: phone.number, usuarioId: novoUsuario.codigo_usuario }));
            await Telefone.bulkCreate(telefones); // Insere múltiplos telefones de uma vez
        }

        res.status(201).json(novoUsuario); // Responde com o novo usuário criado
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(400).json({ error: "Erro ao cadastrar usuário." });
    }
});

// Rota para LISTAR todos os usuários
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            include: [{
                model: Telefone,
                as: 'Telefones',
                attributes: ['numero']
            }]
        });

        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ error: "Erro ao listar usuários." });
    }
});

// Rota para EDITAR um usuário
app.put('/usuarios/:codigo_usuario', async (req, res) => {
    try {
        const [updatedRows] = await Usuario.update({
            usuario: req.body.name,
            senha: req.body.password,
            cep: req.body.cep,
            estado: req.body.uf,
            telefone: JSON.stringify(req.body.phones)
        }, {
            where: {
                codigo_usuario: req.params.codigo_usuario
            }
        });

        if (updatedRows === 0) {

            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        res.status(200).json({ message: "Usuário atualizado com sucesso!" });

    } catch (error) {
        console.error("Erro ao editar usuário:", error);
        res.status(400).json({ error: "Erro ao editar usuário." });
    }
});

// Rota para DELETAR um usuário
app.delete('/usuarios/:codigo_usuario', async (req, res) => {
    try {
        const deletedRows = await Usuario.destroy({
            where: {
                codigo_usuario: req.params.codigo_usuario
            }
        });

        if (deletedRows === 0) {

            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        res.status(200).json({ message: "Usuário deletado com sucesso!" });

    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        res.status(400).json({ error: "Erro ao deletar usuário." });
    }
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
}); 