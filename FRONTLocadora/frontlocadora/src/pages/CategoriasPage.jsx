import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoriasAPI } from "../api";

export default function CategoriasPage() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    const [fNome, setFNome] = useState("");
    const navigate = useNavigate();

    async function load() {
        setLoading(true);
        try {
            const data = await CategoriasAPI.list();
            setCategorias(data);
        } catch (err) {
            alert("Erro ao carregar categorias: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    function applyFilters(items) {
        return items.filter(c =>
            fNome ?
                (c.nome ?? c.Nome ?? "")
                    .toLowerCase()
                    .includes(fNome.toLowerCase())
                : true
        );
    }

    async function handleDelete(id) {
        if (!window.confirm("Excluir categoria id=" + id + "?")) return;

        try {
            await CategoriasAPI.remove(id);
            load();
        } catch (err) {
            alert("Erro: " + err.message);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4>Categorias de Veiculos</h4>
                <Link to="/categorias/novo" className="btn btn-primary">
                    Nova Categoria
                </Link>
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <h6>Filtros</h6>
                    <div className="row g-2">
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                placeholder="Filtrar por nome"
                                value={fNome}
                                onChange={e => setFNome(e.target.value)}
                            />
                        </div>

                        <div className="col-md-2">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setFNome("")}
                            >
                                Limpar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div>Carregando...</div>
            ) : (
                <div className="list-group">
                    {applyFilters(categorias).map(c => (
                        <div key={c.id} className="list-group-item">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5>{c.nome ?? c.Nome}</h5>
                                    <div className="small text-muted">
                                        {c.descricao ?? c.Descricao}
                                    </div>
                                    <div className="small">
                                        <strong>Veiculos associados:</strong>{" "}
                                        {c.veiculos?.length ?? 0}
                                    </div>
                                </div>

                                <div>
                                    <button
                                        className="btn btn-sm btn-info me-2"
                                        onClick={() => navigate(`/categorias/editar/${c.id}`)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(c.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
