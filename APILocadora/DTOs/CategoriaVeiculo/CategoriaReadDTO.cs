namespace APILocadora.DTOs.CategoriaVeiculo
{
    public class CategoriaReadDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }

        public List<VeiculoSimpleDTO> Veiculos { get; set; }
    }

    public class VeiculoSimpleDTO
    {
        public int Id { get; set; }
        public string Modelo { get; set; }
        public string Ano { get; set; }
    }

}
