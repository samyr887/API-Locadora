import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VeiculosAPI } from "../api";

export default function VeiculosPage() {
    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fModelo, setFModelo] = useState("");
    const [fAno, setFAno] = useState("");
    const [fFabricante, setFFabricante] = useState("");
    const navigate = useNavigate();

    async function load() {
        setLoading(true);
        try {
            const data = await VeiculosAPI.list();
            setVeiculos(data);
        } catch (err) {
            alert("Erro ao carregar veiculos: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    function applyFilters(list) {
        return list.filter(v => {
            const modeloOk = fModelo ? v.modelo.toLowerCase().includes(fModelo.toLowerCase()) : true;
            const anoOk = fAno ? v.ano.includes(fAno) : true;
            const fabOk = fFabricante ? v.nomeFabricante.toLowerCase().includes(fFabricante.toLowerCase()) : true;
            return modeloOk && anoOk && fabOk;
        });
    }

    async function handleDelete(id) {
        if (!window.confirm("Excluir veiculo ID " + id + "?")) return;
        try {
            await VeiculosAPI.remove(id);
            load();
        } catch (err) {
            alert("Erro: " + err.message);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4>Veiculos</h4>
                <Link to="/veiculos/novo" className="btn btn-primary">Novo Veiculo</Link>
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <h6>Filtros</h6>
                    <div className="row g-2">
                        <div className="col-md-4">
                            <input placeholder="Modelo"
                                className="form-control"
                                value={fModelo}
                                onChange={e => setFModelo(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <input placeholder="Ano"
                                className="form-control"
                                value={fAno}
                                onChange={e => setFAno(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <input placeholder="Fabricante"
                                className="form-control"
                                value={fFabricante}
                                onChange={e => setFFabricante(e.target.value)} />
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-secondary w-100" onClick={() => {
                                setFModelo(""); setFAno(""); setFFabricante("");
                            }}>Limpar</button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div>Carregando...</div>
            ) : (
                <div className="list-group">
                    {applyFilters(veiculos).map(v => (
                        <div key={v.id} className="list-group-item">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5>{v.modelo}</h5>
                                    <div><strong>Ano:</strong> {v.ano}</div>
                                    <div><strong>Quilometragem:</strong> {v.quilometragem}</div>
                                    <div><strong>Fabricante:</strong> {v.nomeFabricante}</div>
                                    <div><strong>Categoria:</strong> {v.nomeCategoria}</div>
                                </div>

                                <div className="align-self-start">
                                    <button className="btn btn-sm btn-info me-2"
                                        onClick={() => navigate(`/veiculos/editar/${v.id}`)}>
                                        Editar
                                    </button>
                                    <button className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(v.id)}>
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
