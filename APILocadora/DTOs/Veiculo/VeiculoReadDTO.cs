namespace APILocadora.DTOs.Veiculo
{
    public class VeiculoReadDTO
    {
        public int Id { get; set; }
        public string Modelo { get; set; }
        public string Ano { get; set; }
        public string Quilometragem { get; set; }
        public int FabricanteId { get; set; }
        public string NomeFabricante { get; set; }
        public int CategoriaId { get; set; }
        public string NomeCategoria { get; set; }
    }

}
