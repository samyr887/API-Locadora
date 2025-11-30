import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlugueisAPI, ClientesAPI, VeiculosAPI } from "../api";

export default function AluguelForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        clienteId: "",
        veiculoId: "",
        dataInicio: "",
        dataFim: "",
        quilometragemInicial: "",
        valorDiaria: ""
    });

    const [clientes, setClientes] = useState([]);
    const [veiculos, setVeiculos] = useState([]);

    async function loadSelects() {
        setClientes(await ClientesAPI.list());
        setVeiculos(await VeiculosAPI.list());
    }

    async function loadExisting() {
        if (!id) return;
        const data = await AlugueisAPI.get(id);

        setForm({
            clienteId: data.clienteId,
            veiculoId: data.veiculoId,
            dataInicio: data.dataInicio,
            dataFim: data.dataFim,
            quilometragemInicial: data.quilometragemInicial,
            valorDiaria: data.valorDiaria
        });
    }

    useEffect(() => {
        loadSelects();
        if (id) loadExisting();
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (id)
                await AlugueisAPI.update(id, form);
            else
                await AlugueisAPI.start(form);

            navigate("/alugueis");
        } catch (err) {
            alert("Erro: " + err.message);
        }
    }

    return (
        <div className="card p-4">
            <h4>{id ? "Editar Aluguel" : "Iniciar Aluguel"}</h4>

            <form onSubmit={handleSubmit} className="row g-3">

                <div className="col-md-6">
                    <label className="form-label">Cliente</label>
                    <select className="form-select" name="clienteId" value={form.clienteId} onChange={handleChange} required>
                        <option value="">Selecione</option>
                        {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                </div>

                <div className="col-md-6">
                    <label className="form-label">Veiculo</label>
                    <select className="form-select" name="veiculoId" value={form.veiculoId} onChange={handleChange} required>
                        <option value="">Selecione</option>
                        {veiculos.map(v => <option key={v.id} value={v.id}>{v.modelo}</option>)}
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label">Data Inicio</label>
                    <input type="date" className="form-control" name="dataInicio" value={form.dataInicio} onChange={handleChange} required />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Data Fim</label>
                    <input type="date" className="form-control" name="dataFim" value={form.dataFim} onChange={handleChange} required />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Quilometragem Inicial</label>
                    <input type="text" className="form-control" name="quilometragemInicial" value={form.quilometragemInicial} onChange={handleChange} required />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Valor Diaria</label>
                    <input type="number" className="form-control" name="valorDiaria" value={form.valorDiaria} onChange={handleChange} required />
                </div>

                <div className="col-12">
                    <button className="btn btn-primary">Salvar</button>
                    <button type="button" onClick={() => navigate("/alugueis")} className="btn btn-secondary ms-2">Cancelar</button>
                </div>

            </form>
        </div>
    );
}
