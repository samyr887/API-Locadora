import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClientesAPI } from "../api";

export default function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fNome, setFNome] = useState("");
    const [fCpf, setFCpf] = useState("");
    const navigate = useNavigate();

    async function load() {
        setLoading(true);
        try {
            const data = await ClientesAPI.list();
            setClientes(data);
        } catch (err) {
            alert("Erro ao buscar clientes: " + err.message);
        } finally { setLoading(false); }
    }

    useEffect(() => { load(); }, []);

    function applyFilters(items) {
        return items.filter(c => {
            const nomeOk = fNome ? (c.nome || c.Nome || "").toLowerCase().includes(fNome.toLowerCase()) : true;
            const cpfOk = fCpf ? (c.cpf || c.Cpf || "").includes(fCpf) : true;
            return nomeOk && cpfOk;
        });
    }

    async function handleDelete(email) {
        if (!window.confirm("Confirma excluir o cliente " + email + " ?")) return;
        try {
            await ClientesAPI.remove(email);
            alert("Cliente excluído");
            load();
        } catch (err) {
            alert("Erro ao excluir: " + err.message);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4>Clientes</h4>
                <div>
                    <Link to="/clientes/novo" className="btn btn-primary">Novo Cliente</Link>
                </div>
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <h6>Filtros</h6>
                    <div className="row g-2">
                        <div className="col-md-5">
                            <input placeholder="Filtrar por nome" className="form-control" value={fNome} onChange={e => setFNome(e.target.value)} />
                        </div>
                        <div className="col-md-4">
                            <input placeholder="Filtrar por CPF (parcial)" className="form-control" value={fCpf} onChange={e => setFCpf(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-secondary me-2" onClick={() => { setFNome(""); setFCpf(""); }}>Limpar</button>
                            <button className="btn btn-outline-secondary" onClick={load}>Atualizar</button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? <div>Carregando...</div> : (
                <table className="table table-striped">
                    <thead>
                        <tr><th>Nome</th><th>CPF</th><th>Email</th><th>Telefone</th><th></th></tr>
                    </thead>
                    <tbody>
                        {applyFilters(clientes).map(c => (
                            <tr key={c.email || c.Email || c.Id}>
                                <td>{c.nome ?? c.Nome}</td>
                                <td>{c.cpf ?? c.Cpf}</td>
                                <td>{c.email ?? c.Email}</td>
                                <td>{c.telefone ?? c.Telefone}</td>
                                <td style={{ width: 220 }}>
                                    <button className="btn btn-sm btn-info me-2" onClick={() => navigate(`/clientes/editar/${encodeURIComponent(c.email ?? c.Email)}`)}>Editar</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.email ?? c.Email)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}
