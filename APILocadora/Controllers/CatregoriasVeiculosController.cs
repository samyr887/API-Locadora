using APILocadora.Data;
using APILocadora.DTOs.CategoriaVeiculo;
using APILocadora.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APILocadora.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasVeiculosController : ControllerBase
    {
        private readonly LocadoraContext _context;

        public CategoriasVeiculosController(LocadoraContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriaVeiculo>>> GetCategorias()
        {
            return await _context.CategoriasVeiculos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriaVeiculo>> GetCategoria(int id)
        {
            var categoria = await _context.CategoriasVeiculos.FindAsync(id);
            if (categoria == null) 
                return NotFound();
           
            return categoria;
        }

        [HttpPost]
        public async Task<ActionResult<CategoriaVeiculo>> PostCategoria(CategoriaVeiculoDTO dto)
        {
            var categoria = new CategoriaVeiculo
            {
                Nome = dto.Nome,
                Descricao = dto.Descricao
            };

            _context.CategoriasVeiculos.Add(categoria);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCategoria), new { id = categoria.Id }, categoria);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, CategoriaVeiculoDTO categoriaDTO)
        {
            var existente = await _context.CategoriasVeiculos.FindAsync(id);
            if (existente == null)
                return NotFound();

            existente.Nome = categoriaDTO.Nome;
            existente.Descricao = categoriaDTO.Descricao;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            var categoria = await _context.CategoriasVeiculos.FindAsync(id);
            if (categoria == null) 
                return NotFound();

            _context.CategoriasVeiculos.Remove(categoria);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
