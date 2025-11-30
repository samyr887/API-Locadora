import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ClientesPage from "./pages/ClientesPage";
import ClienteForm from "./pages/ClienteForm";
import FabricantesPage from "./pages/FabricantesPage";
import FabricanteForm from "./pages/FabricanteForm";

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
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
