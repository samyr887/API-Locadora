import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClientesAPI } from "../api";

export default function ClienteForm() {
    const params = useParams();
    const editarEmail = params.email;
    const navigate = useNavigate();

    const [form, setForm] = useState({ nome: "", cpf: "", email: "", telefone: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editarEmail) {
            (async () => {
                setLoading(true);
                try {
                    const data = await ClientesAPI.getByEmail(decodeURIComponent(editarEmail));

                    setForm({
                        nome: data.nome || "",
                        cpf: data.cpf || "",
                        email: data.email || "",
                        telefone: data.telefone || ""
                    });

                } catch (err) {
                    alert("Erro ao carregar cliente: " + err.message);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [editarEmail]);


    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const dto = {
                Nome: form.nome,
                Cpf: form.cpf,
                Email: form.email,
                Telefone: form.telefone
            };

            if (editarEmail) {
                await ClientesAPI.update(decodeURIComponent(editarEmail), dto);
                alert("Atualizado!");
            } else {
                await ClientesAPI.create(dto);
                alert("Criado!");
            }

            navigate("/clientes");

        } catch (err) {
            alert("Erro: " + err.message);
        }
    }

    return (
        <div>
            <h4>{editarEmail ? "Editar Cliente" : "Novo Cliente"}</h4>
            {loading ? <div>Carregando...</div> : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label>Nome</label>
                        <input required className="form-control" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                    </div>
                    <div className="mb-2">
                        <label>CPF</label>
                        <input required className="form-control" value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} />
                    </div>
                    <div className="mb-2">
                        <label>Email</label>
                        <input required type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="mb-2">
                        <label>Telefone</label>
                        <input className="form-control" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
                    </div>

                    <button className="btn btn-primary me-2" type="submit">Salvar</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/clientes")}>Cancelar</button>
                </form>
            )}
        </div>
    );
}
