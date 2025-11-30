import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlugueisAPI } from "../api";

export default function AlugueisPage() {
    const [alugueis, setAlugueis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fCliente, setFCliente] = useState("");
    const [fVeiculo, setFVeiculo] = useState("");

    const navigate = useNavigate();

    async function load() {
        setLoading(true);
        try {
            const data = await AlugueisAPI.list();
            setAlugueis(data);
        } catch (err) {
            alert("Erro ao carregar: " + err.message);
        } finally { setLoading(false); }
    }

    useEffect(() => { load(); }, []);

    function applyFilters(items) {
        return items.filter(a => {
            const clienteOk = fCliente ? a.clienteNome.toLowerCase().includes(fCliente.toLowerCase()) : true;
            const veiculoOk = fVeiculo ? a.veiculoModelo.toLowerCase().includes(fVeiculo.toLowerCase()) : true;
            return clienteOk && veiculoOk;
        });
    }

    async function handleDelete(id) {
        if (!window.confirm("Excluir aluguel?")) return;
        try {
            await AlugueisAPI.remove(id);
            load();
        } catch (err) {
            alert("Erro: " + err.message);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between mb-3">
                <h4>Alugueis</h4>
                <Link to="/alugueis/novo" className="btn btn-primary">Novo Aluguel</Link>
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <h6>Filtros</h6>
                    <div className="row g-2">
                        <div className="col-md-4">
                            <input
                                placeholder="Cliente"
                                className="form-control"
                                value={fCliente}
                                onChange={e => setFCliente(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                placeholder="Veiculo"
                                className="form-control"
                                value={fVeiculo}
                                onChange={e => setFVeiculo(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3 d-flex gap-2">
                            <button className="btn btn-secondary" onClick={() => { setFCliente(""); setFVeiculo(""); }}>Limpar</button>
                            <button className="btn btn-outline-secondary" onClick={load}>Atualizar</button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? <div>Carregando...</div> :
                <div className="list-group">
                    {applyFilters(alugueis).map(a => (
                        <div key={a.id} className="list-group-item">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5>{a.veiculoModelo}</h5>
                                    <div><strong>Cliente:</strong> {a.clienteNome}</div>
                                    <div><strong>Inicio:</strong> {a.dataInicio}</div>
                                    <div><strong>Fim:</strong> {a.dataFim}</div>
                                    <div><strong>Valor Total:</strong> R$ {a.valorTotal}</div>
                                </div>

                                <div className="text-end">
                                    <button className="btn btn-sm btn-info me-2" onClick={() => navigate(`/alugueis/editar/${a.id}`)}>Editar</button>
                                    <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/alugueis/finalizar/${a.id}`)}>Finalizar</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)}>Excluir</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </>
    );
}
