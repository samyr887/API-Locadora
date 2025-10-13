using APILocadora.Controllers;
using APILocadora.Data;
using APILocadora.DTOs.Aluguel;
using APILocadora.DTOs.Cliente;
using APILocadora.DTOs.Fabricante;
using APILocadora.DTOs.Veiculo;
using APILocadora.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Xunit;

namespace APILocadora.Test
{
    public class APITest
    {
        private LocadoraContext GetInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<LocadoraContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new LocadoraContext(options);
        }

        public class AluguelFinalizadoResult
        {
            public int Id { get; set; }
            public DateOnly DataInicio { get; set; }
            public DateOnly DataDevolucao { get; set; }
            public decimal ValorDiaria { get; set; }
            public decimal ValorTotal { get; set; }
            public int DiasAlugados { get; set; }
        }

        [Fact]
        public async Task Fabricante_CRUD_Test()
        {
            using var context = GetInMemoryDb();
            var controller = new FabricantesController(context);

            // Create
            var createResult = await controller.PostFabricante(new FabricanteCreateDTO { Nome = "Toyota" });
            var fabricante = (createResult.Result as CreatedAtActionResult)?.Value as Fabricante
                             ?? (createResult.Value as Fabricante);
            Assert.NotNull(fabricante);
            Assert.Equal("Toyota", fabricante.Nome);

            // Read
            var listResult = await controller.GetFabricantes();
            var list = listResult.Value!.ToList();
            Assert.Single(list);

            // Update
            await controller.PutFabricante(fabricante.Id, new FabricanteCreateDTO { Nome = "Honda" });
            var updated = await context.Fabricantes.FindAsync(fabricante.Id);
            Assert.Equal("Honda", updated.Nome);

            // Delete
            await controller.DeleteFabricante(fabricante.Id);
            var deleted = await context.Fabricantes.FindAsync(fabricante.Id);
            Assert.Null(deleted);
        }

        [Fact]
        public async Task Cliente_CRUD_Test()
        {
            using var context = GetInMemoryDb();
            var controller = new ClientesController(context);

            // Create
            var dto = new ClienteDTO { Nome = "Samyr", Cpf = "12345678900", Email = "samyr@test.com", Telefone = "99999999" };
            var createResult = await controller.PostCliente(dto);
            var cliente = (createResult.Result as CreatedAtActionResult)?.Value as Cliente
                          ?? (createResult.Value as Cliente);
            Assert.NotNull(cliente);
            Assert.Equal("Samyr", cliente.Nome);

            // Read
            var getResult = await controller.GetClienteByEmail("samyr@test.com");
            Assert.NotNull(getResult.Value);
            Assert.Equal("Samyr", getResult.Value.Nome);

            // Update
            await controller.PutCliente("samyr@test.com", new ClienteDTO { Nome = "Samyr Updated", Cpf = "12345678900", Email = "samyr@test.com", Telefone = "99999999" });
            var updated = await context.Clientes.FirstOrDefaultAsync(c => c.Email == "samyr@test.com");
            Assert.Equal("Samyr Updated", updated.Nome);

            // Delete
            await controller.DeleteCliente("samyr@test.com");
            var deleted = await context.Clientes.FirstOrDefaultAsync(c => c.Email == "samyr@test.com");
            Assert.Null(deleted);
        }

        [Fact]
        public async Task Veiculo_CRUD_Test()
        {
            using var context = GetInMemoryDb();

            var fabricante = new Fabricante { Nome = "Toyota" };
            var categoria = new CategoriaVeiculo { Nome = "SUV", Descricao = "Veículo SUV" };
            context.Fabricantes.Add(fabricante);
            context.CategoriasVeiculos.Add(categoria);
            await context.SaveChangesAsync();

            var controller = new VeiculosController(context);

            // Create
            var dto = new VeiculoCreateDTO { Modelo = "RAV4", Ano = "2023", Quilometragem = "0", FabricanteId = fabricante.Id, CategoriaId = categoria.Id };
            var createResult = await controller.PostVeiculo(dto);
            var veiculo = (createResult.Result as CreatedAtActionResult)?.Value as Veiculo
                          ?? (createResult.Value as Veiculo);
            Assert.NotNull(veiculo);
            Assert.Equal("RAV4", veiculo.Modelo);

            // Update
            await controller.UpdateVeiculo(veiculo.Id, new VeiculoCreateDTO { Modelo = "RAV4 Updated", Ano = "2023", Quilometragem = "10", FabricanteId = fabricante.Id, CategoriaId = categoria.Id });
            var updated = await context.Veiculos.FindAsync(veiculo.Id);
            Assert.Equal("RAV4 Updated", updated.Modelo);

            // Delete
            await controller.DeleteVeiculo(veiculo.Id);
            var deleted = await context.Veiculos.FindAsync(veiculo.Id);
            Assert.Null(deleted);
        }

        [Fact]
        public async Task Aluguel_CRUD_Test()
        {
            using var context = GetInMemoryDb();

            var cliente = new Cliente { Nome = "Samyr", Cpf = "12345678900", Email = "samyr@test.com", Telefone = "99999999" };
            var fabricante = new Fabricante { Nome = "Toyota" };
            var categoria = new CategoriaVeiculo { Nome = "SUV", Descricao = "Veículo SUV" };
            context.Clientes.Add(cliente);
            context.Fabricantes.Add(fabricante);
            context.CategoriasVeiculos.Add(categoria);
            await context.SaveChangesAsync();

            var veiculo = new Veiculo { Modelo = "RAV4", Ano = "2023", Quilometragem = "0", FabricanteId = fabricante.Id, CategoriaId = categoria.Id };
            context.Veiculos.Add(veiculo);
            await context.SaveChangesAsync();

            var controller = new AlugueisController(context);

            // Iniciar aluguel
            var aluguelDto = new AluguelStartDTO
            {
                ClienteId = cliente.Id,
                VeiculoId = veiculo.Id,
                DataInicio = DateOnly.FromDateTime(DateTime.Now),
                DataFim = DateOnly.FromDateTime(DateTime.Now.AddDays(3)),
                QuilometragemInicial = "0",
                ValorDiaria = 100
            };

            var createResult = await controller.IniciarAluguel(aluguelDto);
            var aluguel = (createResult as CreatedAtActionResult)?.Value as Aluguel ?? createResult as Aluguel;
            Assert.NotNull(aluguel);
            Assert.Equal(cliente.Id, aluguel.ClienteId);

            // Finalizar aluguel
            var finishDto = new AluguelFinishDTO
            {
                DataDevolucao = DateOnly.FromDateTime(DateTime.Now.AddDays(3)),
                QuilometragemFinal = "200"
            };

            var finishResult = await controller.FinalizarAluguel(aluguel.Id, finishDto);
            var okResult = Assert.IsType<OkObjectResult>(finishResult);
            var resultData = okResult.Value!;
            var valorTotal = (double)resultData.GetType().GetProperty("ValorTotal")!.GetValue(resultData)!;
            Assert.Equal(300, valorTotal);

            // Delete
            await controller.DeleteAluguel(aluguel.Id);
            var deleted = await context.Alugueis.FindAsync(aluguel.Id);
            Assert.Null(deleted);
        }
    }
}
