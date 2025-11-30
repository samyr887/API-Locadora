using APILocadora.Data;
using APILocadora.DTOs.Cliente;
using APILocadora.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APILocadora.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly LocadoraContext _context;

        public ClientesController(LocadoraContext context)
        {
            _context = context;
        }

        // GET: api/Clientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            return await _context.Clientes.ToListAsync();
        }

        // GET: api/Clientes/{email}
        [HttpGet("{email}")]
        public async Task<ActionResult<Cliente>> GetClienteByEmail(string email)
        {
            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Email == email);
            if (cliente == null) return NotFound();
            return cliente;
        }

        // POST: api/Clientes
        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(ClienteDTO dto)
        {
            var cliente = new Cliente
            {
                Nome = dto.Nome,
                Cpf = dto.Cpf,
                Email = dto.Email,
                Telefone = dto.Telefone
            };

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetClienteByEmail), new { email = cliente.Email }, cliente);
        }

        // PUT: api/Clientes/{email}
        [HttpPut("{email}")]
        public async Task<IActionResult> PutCliente(string email, ClienteDTO clienteDTO)
        {
            var clienteExistente = await _context.Clientes.FirstOrDefaultAsync(c => c.Email == email);
            if (clienteExistente == null) return NotFound();

            clienteExistente.Nome = clienteDTO.Nome;
            clienteExistente.Email = clienteDTO.Email;
            clienteExistente.Cpf = clienteDTO.Cpf;
            clienteExistente.Telefone = clienteDTO.Telefone;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Clientes/{email}
        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteCliente(string email)
        {
            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Email == email);
            if (cliente == null) return NotFound();

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

