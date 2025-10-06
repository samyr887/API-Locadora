using APILocadora.Data;
using APILocadora.DTOs.Veiculo;
using APILocadora.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APILocadora.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VeiculosController : ControllerBase
    {
        private readonly LocadoraContext _context;

        public VeiculosController(LocadoraContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VeiculoReadDTO>>> GetVeiculos()
        {
            var veiculos = await _context.Veiculos
                .Include(v => v.Fabricante)
                .Include(v => v.Categoria)
                .Select(v => new VeiculoReadDTO
                {
                    Id = v.Id,
                    Modelo = v.Modelo,
                    Ano = v.Ano,
                    Quilometragem = v.Quilometragem,
                    FabricanteId = v.FabricanteId,
                    NomeFabricante = v.Fabricante.Nome,
                    CategoriaId = v.CategoriaId,
                    NomeCategoria = v.Categoria.Nome
                }).ToListAsync();

            return Ok(veiculos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VeiculoReadDTO>> GetVeiculo(int id)
        {
            var veiculo = await _context.Veiculos
                .Include(v => v.Fabricante)
                .Include(v => v.Categoria)
                .Where(v => v.Id == id)
                .Select(v => new VeiculoReadDTO
                {
                    Id = v.Id,
                    Modelo = v.Modelo,
                    Ano = v.Ano,
                    Quilometragem = v.Quilometragem,
                    NomeFabricante = v.Fabricante.Nome,
                    NomeCategoria = v.Categoria.Nome
                })
                .FirstOrDefaultAsync();

            if (veiculo == null)
                return NotFound();

            return veiculo;
        }


        [HttpPost]
        public async Task<ActionResult<Veiculo>> PostVeiculo(VeiculoCreateDTO dto)
        {
            var veiculo = new Veiculo
            {
                Modelo = dto.Modelo,
                Ano = dto.Ano,
                Quilometragem = dto.Quilometragem,
                FabricanteId = dto.FabricanteId,
                CategoriaId = dto.CategoriaId
            };

            _context.Veiculos.Add(veiculo);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetVeiculo), new { id = veiculo.Id }, veiculo);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVeiculo(int id, VeiculoCreateDTO veiculoDTO)
        {
            var veiculo = await _context.Veiculos.FindAsync(id);
            if (veiculo == null)
                return NotFound();

            veiculo.Modelo = veiculoDTO.Modelo;
            veiculo.Ano = veiculoDTO.Ano;
            veiculo.Quilometragem = veiculoDTO.Quilometragem;
            veiculo.FabricanteId = veiculoDTO.FabricanteId;
            veiculo.CategoriaId = veiculoDTO.CategoriaId;

            _context.Veiculos.Update(veiculo);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVeiculo(int id)
        {
            var veiculo = await _context.Veiculos.FindAsync(id);
            if (veiculo == null) 
                return NotFound();

            _context.Veiculos.Remove(veiculo);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
