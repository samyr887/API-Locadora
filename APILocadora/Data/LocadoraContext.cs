using APILocadora.Models;
using Microsoft.EntityFrameworkCore;

namespace APILocadora.Data
{
    public class LocadoraContext : DbContext
    {
        public LocadoraContext(DbContextOptions<LocadoraContext> options) : base(options) { }
       
        public DbSet<Models.Veiculo> Veiculos { get; set; }
        public DbSet<Models.Aluguel> Alugueis { get; set; }
        public DbSet<Models.Cliente> Clientes { get; set; }
        public DbSet<Models.CategoriaVeiculo> CategoriasVeiculos { get; set; }
        public DbSet<Models.Fabricante> Fabricantes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>()
                .HasIndex(c => c.Cpf).IsUnique();

            modelBuilder.Entity<Cliente>()
                .HasIndex(c => c.Email).IsUnique();
        }
    }
}
