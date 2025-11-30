import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CategoriasAPI } from "../api";

export default function CategoriaForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        nome: "",
        descricao: ""
    });

    useEffect(() => {
        if (id) load();
    }, [id]);

    async function load() {
        setLoading(true);
        try {
            const data = await CategoriasAPI.get(id);
            setForm({
                nome: data.nome ?? "",
                descricao: data.descricao ?? ""
            });
        } catch (err) {
            alert("Erro ao carregar categoria: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    function updateField(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function save(e) {
        e.preventDefault();

        try {
            if (id)
                await CategoriasAPI.update(id, form);
            else
                await CategoriasAPI.create(form);

            navigate("/categorias");
        } catch (err) {
            alert("Erro: " + err.message);
        }
    }

    return (
        <div>
            <h4>{id ? "Editar Categoria" : "Nova Categoria"}</h4>
            {loading ? <div>Carregando...</div> : (

            <form onSubmit={save}>

                <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input
                        className="form-control"
                        value={form.nome}
                        onChange={e => updateField("nome", e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Descricao</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={form.descricao}
                        onChange={e => updateField("descricao", e.target.value)}
                    />
                </div>

                <button className="btn btn-primary me-2" type="submit">Salvar</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/categorias")}>Cancelar</button>
                </form>
            )}
        </div>
    );
}
