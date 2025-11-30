namespace APILocadora.DTOs.Aluguel
{
    public class AluguelUpdateDTO
    {

        public DateOnly DataInicio { get; set; }
        public DateOnly DataFim { get; set; }

        public string? QuilometragemInicial { get; set; }

        public double ValorDiaria { get; set; }

        public int ClienteId { get; set; }

        public int VeiculoId { get; set; }
    }
}