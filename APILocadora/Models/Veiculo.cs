namespace APILocadora.Models
{
    public class Veiculo
    {
        public int Id { get; set; }
        public string? Modelo { get; set; }
        public string Ano { get; set; }
        public string? Quilometragem { get; set; }


        public int FabricanteId { get; set; }
        public Fabricante? Fabricante { get; set; }

        public int CategoriaId { get; set; }
        public CategoriaVeiculo Categoria { get; set; }

        public ICollection<Aluguel> Alugueis { get; set; }
    }
}
