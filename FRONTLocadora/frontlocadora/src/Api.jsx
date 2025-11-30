const BASE = import.meta.env.VITE_API_BASE_URL;

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
    }

  if (res.status === 204) return null;
  return res.json();
}

export const ClientesAPI = {
  list: () => request("/Clientes"),
  getByEmail: (email) => request(`/Clientes/${encodeURIComponent(email)}`),
  create: (cliente) => request("/Clientes", { method: "POST", body: JSON.stringify(cliente) }),
  update: (email, cliente) => request(`/Clientes/${encodeURIComponent(email)}`, { method: "PUT", body: JSON.stringify(cliente) }),
  remove: (email) => request(`/Clientes/${encodeURIComponent(email)}`, { method: "DELETE" }),
};

export const FabricantesAPI = {
  list: () => request("/api/Fabricantes"),
  get: (id) => request(`/api/Fabricantes/${id}`),
  create: (fabricante) => request("/api/Fabricantes", { method: "POST", body: JSON.stringify(fabricante) }),
  update: (id, fabricante) => request(`/api/Fabricantes/${id}`, { method: "PUT", body: JSON.stringify(fabricante) }),
  remove: (id) => request(`/api/Fabricantes/${id}`, { method: "DELETE" }),
};

export const CategoriasAPI = {
  list: () => request("/api/CategoriasVeiculos"),
  get: (id) => request(`/api/CategoriasVeiculos/${id}`),
  create: (categoria) => request("/api/CategoriasVeiculos", { method: "POST", body: JSON.stringify(categoria) }),
  update: (id, categoria) => request(`/api/CategoriasVeiculos/${id}`, { method: "PUT", body: JSON.stringify(categoria) }),
  remove: (id) => request(`/api/CategoriasVeiculos/${id}`, { method: "DELETE" }),
};

export const VeiculosAPI = {
    list: () => request("/api/Veiculos"),
    get: (id) => request(`/api/Veiculos/${id}`),
    create: (veiculo) => request("/api/Veiculos", { method: "POST", body: JSON.stringify(veiculo), }),
    update: (id, veiculo) => request(`/api/Veiculos/${id}`, { method: "PUT", body: JSON.stringify(veiculo), }),
    remove: (id) => request(`/api/Veiculos/${id}`, { method: "DELETE", }),
};

export const AlugueisAPI = {
    list: () => request("/api/Alugueis"),
    get: (id) => request(`/api/Alugueis/${id}`),
    start: (aluguel) => request("/api/Alugueis/iniciar", { method: "POST", body: JSON.stringify(aluguel) }),
    finish: (id, dados) => request(`/api/Alugueis/finalizar/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
    update: (id, aluguel) => request(`/api/Alugueis/${id}`, { method: "PUT", body: JSON.stringify(aluguel) }),
    remove: (id) => request(`/api/Alugueis/${id}`, { method: "DELETE" }),
};
