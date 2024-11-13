
import { useEffect } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import api from "../services/api";
import { PatternFormat } from 'react-number-format';

const GoodForm = () => {

    // Hook para gerenciamento do formulário
    const { getValues, register, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            phones: [{ number: "" }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "phones",
    });

    // Função para buscar o CEP e preencher o estado
    const buscarCep = (event) => {
        const cep = event.target.value;

        if (cep.length === 8) {
            axios.get('https://viacep.com.br/ws/' + cep + '/json/').then((resultado) => {
                const endereco = resultado.data;
                setValue('uf', endereco.uf); // Define o estado com o valor retornado pela API
            });
            console.log(cep);
        }
    };

    // Função para envio do formulário para o backend
    const onSubmit = async (data) => {
        try {
            const formattedData = {
                name: data.name,
                password: data.password,
                cep: data.cep,
                uf: data.uf,
                phones: data.phones.map(phone => ({ number: phone.number }))
            };

            const response = await api.post('/usuarios', formattedData); // Ajuste a URL se necessário
            if (response.status === 201) {
                alert("Usuário cadastrado com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            alert("Houve um erro ao cadastrar o usuário.");
        }
    };

    // Função para obter usuários (se necessário)
    useEffect(() => {

        let users = []

        async function getUsers() {
            const usersFromApi = await api.get('./usuarios')

            users = usersFromApi.data

            console.log(users)
        }

        getUsers()
    }, [])

    return (
        <div className="app-container">

            <h2>Cadastrar usuário</h2>

            <div className="form-group">
                <label>Nome</label>
                <input
                    className={errors?.name && "input-error"}
                    type="text"
                    placeholder="Digite seu nome"
                    {...register("name", { required: true })}
                />
                {errors?.name?.type === "required" && (
                    <p className="error-message">Usuário é obrigatório.</p>
                )}
            </div>

            <div className="form-group">
                <label>Senha</label>
                <input
                    className={errors?.password && "input-error"}
                    type="password"
                    placeholder="Digite sua senha"
                    {...register("password", { required: true, minLength: 7 })}
                />

                {errors?.password?.type === "required" && (
                    <p className="error-message">Senha é obrigatória.</p>
                )}

                {errors?.password?.type === "minLength" && (
                    <p className="error-message">
                        A senha deve ter no mínimo 7 caracteres.
                    </p>
                )}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>CEP</label>
                    <input
                        type="text"
                        placeholder="Digite seu CEP"
                        {...register("cep", { required: true })}
                        onChange={buscarCep}
                    />
                    {errors?.cep?.type === "required" && (
                        <p className="error-message">CEP é obrigatório.</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Estado</label>
                    <input
                        type="text"
                        {...register("uf", { required: true })}
                        readOnly
                    />
                    {errors?.uf?.type === "required" && (
                        <p className="error-message">Estado é obrigatório.</p>
                    )}
                </div>
            </div>

            <div className="form-group">
                <label>Telefone</label>

                {fields.map((item, index) => (
                    <div key={item.id} className="phone-group">
                        <PatternFormat
                            format="(##) #####-####"
                            className={errors?.phones?.[index]?.number && "input-error"}
                            type="text"
                            placeholder={`Insira DDD + Telefone ${index + 1}`}
                            {...register(`phones.${index}.number`, { required: true })}
                            onValueChange={(values) => {
                                // Atualiza o valor limpo sem formatação
                                setValue(`phones.${index}.number`, values.value.replace(/\D/g, ''));
                            }}
                        />
                        {index > 0 && (
                            <a href="#" className="remove-phone" onClick={() => remove(index)}>
                                Remover telefone
                            </a>
                        )}
                        {errors?.phones?.[index]?.number?.type === "required" && (
                            <p className="error-message">Telefone é obrigatório.</p>
                        )}
                    </div>

                ))}
                <a href="#" className="add-phone" onClick={() => append({ number: "" })}>
                    Adicionar Telefone
                </a>
            </div>

            <div className="form-group">
                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        name="privacy-policy"
                        {...register("privacyTerms", {
                            validate: (value) => value === true,
                        })}
                    />
                    <label>Eu concordo com os termos de privacidade.</label>
                </div>
                {errors?.privacyTerms?.type === "validate" && (
                    <p className="error-message">
                        Você deve concordar com os termos de privacidade.
                    </p>
                )}
            </div>

            <div className="form-group">
                <button type="button" onClick={() => {
                    const values = getValues()
                    console.log(values)
                    onSubmit(values)
                }}>
                    Cadastrar-se</button>
            </div>
        </div>
    );
};

export default GoodForm;