namespace APILocadora.Models
{
    public class Aluguel
    {
        public int Id { get; set; }
        
        public DateOnly DataInicio { get; set; }
        public DateOnly DataFim { get; set; }
        public DateOnly DataDevolucao { get; set; }

        public string? QuilometragemInicial { get; set; }
        public string? QuilometragemFinal { get; set; }

        public double ValorDiaria { get; set; }
        public double ValorTotal { get; set; }
        
        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }
        
        public int VeiculoId { get; set; }
        public Veiculo? Veiculo { get; set; }
    }
}
