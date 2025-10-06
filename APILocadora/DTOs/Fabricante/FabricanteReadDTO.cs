using APILocadora.DTOs.Veiculo;

namespace APILocadora.DTOs.Fabricante
{
    public class FabricanteReadDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; }

        public List<VeiculoResumoDTO> Veiculos { get; set; }
    }
}