import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlugueisAPI } from "../api";

export default function AluguelFinalizar() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        dataDevolucao: "",
        quilometragemFinal: ""
    });

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await AlugueisAPI.finish(id, form);
            alert("Aluguel finalizado!");
            navigate("/alugueis");
        } catch (err) {
            alert("Erro: " + err.message);
        }
    }

    return (
        <div className="card p-4">
            <h4>Finalizar Aluguel #{id}</h4>
            <form onSubmit={handleSubmit} className="row g-3">

                <div className="col-md-6">
                    <label className="form-label">Data Devolucao</label>
                    <input type="date" name="dataDevolucao" className="form-control"
                        value={form.dataDevolucao}
                        onChange={e => setForm({ ...form, dataDevolucao: e.target.value })}
                        required />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Quilometragem Final</label>
                    <input type="text" name="quilometragemFinal" className="form-control"
                        value={form.quilometragemFinal}
                        onChange={e => setForm({ ...form, quilometragemFinal: e.target.value })}
                        required />
                </div>

                <div className="col-12">
                    <button className="btn btn-success">Finalizar</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/alugueis")}>Cancelar</button>
                </div>

            </form>
        </div>
    );
}
