import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VeiculosAPI, FabricantesAPI, CategoriasAPI } from "../api";

export default function VeiculoForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [modelo, setModelo] = useState("");
    const [ano, setAno] = useState("");
    const [km, setKm] = useState("");
    const [fabricanteId, setFabricanteId] = useState("");
    const [categoriaId, setCategoriaId] = useState("");

    const [fabricantes, setFabricantes] = useState([]);
    const [categorias, setCategorias] = useState([]);

    async function loadDropdowns() {
        setFabricantes(await FabricantesAPI.list());
        setCategorias(await CategoriasAPI.list());
    }

    async function loadVeiculo() {
        if (!id) return;
        const v = await VeiculosAPI.get(id);
        setModelo(v.modelo);
        setAno(v.ano);
        setKm(v.quilometragem);
        setFabricanteId(v.fabricanteId);
        setCategoriaId(v.categoriaId);
    }

    useEffect(() => {
        loadDropdowns();
        loadVeiculo();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        const body = {
            modelo,
            ano,
            quilometragem: km,
            fabricanteId: Number(fabricanteId),
            categoriaId: Number(categoriaId)
        };

        try {
            if (id)
                await VeiculosAPI.update(id, body);
            else
                await VeiculosAPI.create(body);

            navigate("/veiculos");
        } catch (err) {
            alert("Erro: " + err.message);
        }
    }

    return (
        <div className="card">
            <div className="card-body">
                <h4>{id ? "Editar Veiculo" : "Novo Veiculo"}</h4>

                <form onSubmit={handleSubmit} className="mt-3">

                    <div className="mb-2">
                        <label>Modelo</label>
                        <input className="form-control"
                            value={modelo}
                            onChange={e => setModelo(e.target.value)}
                            required />
                    </div>

                    <div className="mb-2">
                        <label>Ano</label>
                        <input className="form-control"
                            value={ano}
                            onChange={e => setAno(e.target.value)}
                            required />
                    </div>

                    <div className="mb-2">
                        <label>Quilometragem</label>
                        <input className="form-control"
                            value={km}
                            onChange={e => setKm(e.target.value)} />
                    </div>

                    <div className="mb-2">
                        <label>Fabricante</label>
                        <select className="form-control"
                            value={fabricanteId}
                            onChange={e => setFabricanteId(e.target.value)}
                            required>
                            <option value="">Selecione...</option>
                            {fabricantes.map(f => (
                                <option key={f.id} value={f.id}>{f.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label>Categoria</label>
                        <select className="form-control"
                            value={categoriaId}
                            onChange={e => setCategoriaId(e.target.value)}
                            required>
                            <option value="">Selecione...</option>
                            {categorias.map(c => (
                                <option key={c.id} value={c.id}>{c.nome}</option>
                            ))}
                        </select>
                    </div>

                    <button className="btn btn-primary me-3">Salvar</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/Veiculos")}>Cancelar</button>
                </form>
            </div>
        </div>
    );
}
