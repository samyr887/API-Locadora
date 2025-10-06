namespace APILocadora.DTOs.Veiculo
{
    public class VeiculoCreateDTO
    {
        public string Modelo { get; set; }
        public string Ano { get; set; }
        public string Quilometragem { get; set; }
        public int FabricanteId { get; set; }
        public int CategoriaId { get; set; }
    }
}
