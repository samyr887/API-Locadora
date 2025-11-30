import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ClientesPage from "./pages/ClientesPage";
import ClienteForm from "./pages/ClienteForm";
import FabricantesPage from "./pages/FabricantesPage";
import FabricanteForm from "./pages/FabricanteForm";
import CategoriasPage from "./pages/CategoriasPage";
import CategoriaForm from "./pages/CategoriaForm";
import VeiculosPage from "./pages/VeiculosPage";
import VeiculoForm from "./pages/VeiculoForm";
import AlugueisPage from "./pages/AlugueisPage";
import AluguelForm from "./pages/AluguelForm";
import AluguelFinalizar from "./pages/AluguelFinalizar";

function App() {
    return (
        <BrowserRouter>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3">
                <div className="container-fluid px-4">
                    <Link className="navbar-brand" to="/">Locadora - Front</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav">
                            <li className="nav-item"><Link className="nav-link" to="/clientes">Clientes</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/fabricantes">Fabricantes</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/categorias">Categorias</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/veiculos">Veiculos</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/alugueis">Alugueis</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container-fluid px-4">
                <Routes>
                    <Route path="/" element={<h3>Escolha uma entidade no menu</h3>} />
                    <Route path="/clientes" element={<ClientesPage />} />
                    <Route path="/clientes/novo" element={<ClienteForm />} />
                    <Route path="/clientes/editar/:email" element={<ClienteForm />} />
                    <Route path="/fabricantes" element={<FabricantesPage />} />
                    <Route path="/fabricantes/novo" element={<FabricanteForm />} />
                    <Route path="/fabricantes/editar/:id" element={<FabricanteForm />} />
                    <Route path="/categorias" element={<CategoriasPage />} />
                    <Route path="/categorias/novo" element={<CategoriaForm />} />
                    <Route path="/categorias/editar/:id" element={<CategoriaForm />} />
                    <Route path="/veiculos" element={<VeiculosPage />} />
                    <Route path="/veiculos/novo" element={<VeiculoForm />} />
                    <Route path="/veiculos/editar/:id" element={<VeiculoForm />} />
                    <Route path="/alugueis" element={<AlugueisPage />} />
                    <Route path="/alugueis/novo" element={<AluguelForm />} />
                    <Route path="/alugueis/editar/:id" element={<AluguelForm />} />
                    <Route path="/alugueis/finalizar/:id" element={<AluguelFinalizar />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
