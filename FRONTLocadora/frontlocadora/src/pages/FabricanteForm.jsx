import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FabricantesAPI } from "../api";

export default function FabricanteForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            (async () => {
                setLoading(true);
                try {
                    const f = await FabricantesAPI.get(id);
                    setNome(f.nome ?? f.Nome ?? "");
                } catch (err) {
                    alert("Erro: " + err.message);
                } finally { setLoading(false); }
            })();
        }
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (id) {
                await FabricantesAPI.update(id, { Nome: nome });
                alert("Atualizado");
            } else {
                await FabricantesAPI.create({ Nome: nome });
                alert("Criado");
            }
            navigate("/fabricantes");
        } catch (err) { alert("Erro: " + err.message); }
    }

    return (
        <div>
            <h4>{id ? "Editar Fabricante" : "Novo Fabricante"}</h4>
            {loading ? <div>Carregando...</div> : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label>Nome</label>
                        <input required className="form-control" value={nome} onChange={e => setNome(e.target.value)} />
                    </div>
                    <button className="btn btn-primary me-2" type="submit">Salvar</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/fabricantes")}>Cancelar</button>
                </form>
            )}
        </div>
    );
}
