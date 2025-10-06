using APILocadora.Data;
using APILocadora.DTOs.Aluguel;
using APILocadora.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APILocadora.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlugueisController : ControllerBase
    {
        private readonly LocadoraContext _context;

        public AlugueisController(LocadoraContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAlugueis()
        {
            var alugueis = await _context.Alugueis
                .Include(a => a.Cliente)
                .Include(a => a.Veiculo)
                .Select(a => new AluguelReadDTO
                {
                    Id = a.Id,
                    DataInicio = a.DataInicio,
                    DataFim = a.DataFim,
                    DataDevolucao = a.DataDevolucao,
                    QuilometragemInicial = a.QuilometragemInicial,
                    QuilometragemFinal = a.QuilometragemFinal,
                    ValorDiaria = a.ValorDiaria,
                    ValorTotal = a.ValorTotal,
                    ClienteNome = a.Cliente.Nome,
                    VeiculoModelo = a.Veiculo.Modelo
                })
                .ToListAsync();

            return Ok(alugueis);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Aluguel>> GetAluguel(int id)
        {
            var aluguel = await _context.Alugueis
                .Include(a => a.Cliente)
                .Include(a => a.Veiculo)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aluguel == null) 
                return NotFound();

            var dto = new AluguelReadDTO
            {
                Id = aluguel.Id,
                DataInicio = aluguel.DataInicio,
                DataFim = aluguel.DataFim,
                DataDevolucao = aluguel.DataDevolucao,
                QuilometragemInicial = aluguel.QuilometragemInicial,
                QuilometragemFinal = aluguel.QuilometragemFinal,
                ValorDiaria = aluguel.ValorDiaria,
                ValorTotal = aluguel.ValorTotal,
                ClienteNome = aluguel.Cliente.Nome,
                VeiculoModelo = aluguel.Veiculo.Modelo
            };

            return Ok(dto);
        }

        [HttpPost("iniciar")]
        public async Task<IActionResult> IniciarAluguel(AluguelStartDTO dto)
        {
            var aluguel = new Aluguel
            {
                ClienteId = dto.ClienteId,
                VeiculoId = dto.VeiculoId,
                DataInicio = dto.DataInicio,
                DataFim = dto.DataFim,
                QuilometragemInicial = dto.QuilometragemInicial,
                ValorDiaria = dto.ValorDiaria,
            };

            _context.Alugueis.Add(aluguel);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAluguel), new { id = aluguel.Id }, aluguel);
        }

        [HttpPut("finalizar/{id}")]
        public async Task<IActionResult> FinalizarAluguel(int id, AluguelFinishDTO dto)
        {
            var aluguel = await _context.Alugueis.FindAsync(id);
            if (aluguel == null)
                return NotFound();

            if (dto.DataDevolucao == null)
                return BadRequest("A data de devolução é obrigatória.");

            aluguel.DataDevolucao = dto.DataDevolucao;
            aluguel.QuilometragemFinal = dto.QuilometragemFinal;

            int dias = (dto.DataDevolucao.Value.ToDateTime(TimeOnly.MinValue) -
                        aluguel.DataInicio.ToDateTime(TimeOnly.MinValue)).Days;

            if (dias < 1)
                dias = 1;

            aluguel.ValorTotal = dias * aluguel.ValorDiaria;

            _context.Alugueis.Update(aluguel);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                aluguel.Id,
                aluguel.DataInicio,
                aluguel.DataDevolucao,
                aluguel.ValorDiaria,
                aluguel.ValorTotal,
                DiasAlugados = dias
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAluguel(int id, AluguelUpdateDTO aluguelDTO)
        {
            var existente = await _context.Alugueis.FindAsync(id);
            if (existente == null) 
                return NotFound();

            existente.ClienteId = aluguelDTO.ClienteId;
            existente.VeiculoId = aluguelDTO.VeiculoId;
            existente.DataInicio = aluguelDTO.DataInicio;
            existente.DataFim = aluguelDTO.DataFim;       
            existente.QuilometragemInicial = aluguelDTO.QuilometragemInicial;
            existente.ValorDiaria = aluguelDTO.ValorDiaria;

            if (existente.DataInicio != default && existente.DataFim != default)
            {
                int dias = existente.DataFim.DayNumber - existente.DataInicio.DayNumber;

                if (dias < 1) dias = 1;

                existente.ValorTotal = dias * existente.ValorDiaria;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAluguel(int id)
        {
            var aluguel = await _context.Alugueis.FindAsync(id);
            if (aluguel == null) 
                return NotFound();

            _context.Alugueis.Remove(aluguel);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
