namespace APILocadora.DTOs.Aluguel
{
    public class AluguelStartDTO
    {
        public int ClienteId { get; set; }
        public int VeiculoId { get; set; }
        public DateOnly DataInicio { get; set; }
        public DateOnly DataFim { get; set; }
        public string QuilometragemInicial { get; set; }
        public double ValorDiaria { get; set; }
    }
}