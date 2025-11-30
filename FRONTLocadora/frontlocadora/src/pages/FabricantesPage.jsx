import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FabricantesAPI } from "../api";

export default function FabricantesPage() {
    const [fabricantes, setFabricantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fNome, setFNome] = useState("");
    const [fMinVeiculos, setFMinVeiculos] = useState("");
    const [fVehicleModel, setFVehicleModel] = useState("");

    const navigate = useNavigate();

    async function load() {
        setLoading(true);
        try {
            const data = await FabricantesAPI.list();
            setFabricantes(data);
        } catch (err) {
            alert("Erro: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function applyFilters(items) {
        return items.filter(f => {
            const nomeOk = fNome
                ? (f.nome ?? f.Nome ?? "").toLowerCase().includes(fNome.toLowerCase())
                : true;

            const minOk = fMinVeiculos
                ? ((f.veiculos?.length ?? 0) >= Number(fMinVeiculos))
                : true;

            const modelOk = fVehicleModel
                ? ((f.veiculos || []).some(v =>
                    (v.modelo ?? v.Modelo ?? "").toLowerCase().includes(fVehicleModel.toLowerCase())
                ))
                : true;

            return nomeOk && minOk && modelOk;
        });
    }

    async function handleDelete(id) {
        if (!window.confirm("Excluir fabricante id=" + id + " ?")) return;

        try {
            await FabricantesAPI.remove(id);
            alert("Excluido");
            load();
        } catch (err) {
            alert("Erro: " + err.message);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4>Fabricantes</h4>
                <Link to="/fabricantes/novo" className="btn btn-primary">
                    Novo Fabricante
                </Link>
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <h6>Filtros</h6>

                    <div className="row g-2">
                        <div className="col-md-4">
                            <input placeholder="Filtrar por nome" className="form-control" value={fNome} onChange={e => setFNome(e.target.value)}/>
                        </div>

                        <div className="col-md-3">
                            <input type="number" min="0" placeholder="Min veiculos" className="form-control" value={fMinVeiculos} onChange={e => setFMinVeiculos(e.target.value)}/>
                        </div>

                        <div className="col-md-3">
                            <input placeholder="Pesquisar modelo (veiculos)" className="form-control" value={fVehicleModel} onChange={e => setFVehicleModel(e.target.value)}/>
                        </div>

                        <div className="col-md-2 d-flex gap-2">
                            <button className="btn btn-secondary" onClick={() => {
                                    setFNome("");
                                    setFMinVeiculos("");
                                    setFVehicleModel("");
                                }}
                            >
                                Limpar
                            </button>

                            <button className="btn btn-outline-secondary" onClick={load}>
                                Atualizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div>Carregando...</div>
            ) : (
                <div className="list-group">
                    {applyFilters(fabricantes).map(f => (
                        <div key={f.id} className="list-group-item">

                            <div className="d-flex justify-content-between">

                                <div>
                                    <h5>{f.nome ?? f.Nome}</h5>

                                    <div>
                                        <strong>Veiculos:</strong>{" "}
                                        {(f.veiculos?.length ?? 0)}
                                    </div>

                                    {f.veiculos?.length ? (
                                        <div className="small text-dark">
                                            {f.veiculos.map(v => (
                                                <div key={v.id}>
                                                    > {v.modelo ?? v.Modelo} - {v.ano ?? v.Ano}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="small text-muted">
                                            Sem veiculos
                                        </div>
                                    )}
                                </div>

                                <div className="align-self-start">
                                    <button
                                        className="btn btn-sm btn-info me-2"
                                        onClick={() => navigate(`/fabricantes/editar/${f.id}`)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(f.id)}
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
