using APILocadora.Data;
using APILocadora.DTOs.Fabricante;
using APILocadora.DTOs.Veiculo;
using APILocadora.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APILocadora.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FabricantesController : ControllerBase
    {
        private readonly LocadoraContext _context;

        public FabricantesController(LocadoraContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FabricanteReadDTO>>> GetFabricantes()
        {
            var fabricantes = await _context.Fabricantes
                .Include(f => f.Veiculos)
                .Select(f => new FabricanteReadDTO
                {
                    Id = f.Id,
                    Nome = f.Nome,
                    Veiculos = f.Veiculos.Select(v => new VeiculoResumoDTO
                    {
                        Id = v.Id,
                        Modelo = v.Modelo,
                        Ano = v.Ano
                    }).ToList()
                })
                .ToListAsync();

            return fabricantes;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<FabricanteReadDTO>> GetFabricante(int id)
        {
            var fabricante = await _context.Fabricantes
                .Include(f => f.Veiculos)
                .Select(f => new FabricanteReadDTO
                {
                    Id = f.Id,
                    Nome = f.Nome,
                    Veiculos = f.Veiculos.Select(v => new VeiculoResumoDTO
                    {
                        Id = v.Id,
                        Modelo = v.Modelo,
                        Ano = v.Ano
                    }).ToList()
                })
                .FirstOrDefaultAsync(f => f.Id == id);

            if (fabricante == null)
                return NotFound();

            return Ok(fabricante);
        }


        [HttpPost]
        public async Task<ActionResult<Fabricante>> PostFabricante(FabricanteCreateDTO dto)
        {
            var fabricante = new Fabricante
            {
                Nome = dto.Nome
            };

            _context.Fabricantes.Add(fabricante);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetFabricante), new { id = fabricante.Id }, fabricante);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFabricante(int id, FabricanteCreateDTO fabricanteDTO)
        {
            var existente = await _context.Fabricantes.FindAsync(id);         
            if (existente == null) 
                return NotFound();

            existente.Nome = fabricanteDTO.Nome;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFabricante(int id)
        {
            var fabricante = await _context.Fabricantes.FindAsync(id);
            if (fabricante == null) 
                return NotFound();

            _context.Fabricantes.Remove(fabricante);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
