import { useEffect, useState } from "react";
import api from "../services/api";
import { PatternFormat } from 'react-number-format';

const Usuarios = () => {
    // Estado para armazenar a lista de usuários
    const [users, setUsers] = useState([]);

    // Função para obter usuários ao montar o componente
    useEffect(() => {
        async function getUsers() {
            try {
                const usersFromApi = await api.get('/usuarios');
                setUsers(usersFromApi.data);  // Atualiza o estado 'users' com os dados da API
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        }
        getUsers();

    }, []);

    return (
        <div >
            <h2 className="usuarios-title">Usuários cadastrados</h2>
            {users.length > 0 ? (
                <ul>
                    {users.map((user) => (
                        <div key={user.codigo_usuario}>
                            <span><strong>Código do usuário: </strong>{user.codigo_usuario}</span><br />
                            <span><strong>Nome: </strong>{user.usuario}</span><br />
                            <span><strong>CEP: </strong>{user.cep}</span><br />
                            <span><strong>Estado: </strong>{user.estado}</span><br />
                            <span><strong>Telefone: </strong></span>
                            {user.Telefones && user.Telefones.length > 0 ? (
                                <ul className="telefone-list">
                                    {user.Telefones.map((telefone, index) => (
                                        <li key={index}>
                                            <PatternFormat
                                                value={telefone.numero}
                                                format="(##) #####-####"
                                                displayType="text"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span>Nenhum telefone cadastrado</span>
                            )}
                            <hr />
                        </div>
                    ))}
                </ul>
            ) : (
                <p>Nenhum usuário encontrado.</p>
            )}
        </div>
    );
};

export default Usuarios;