namespace APILocadora.DTOs.Aluguel
{
    public class AluguelReadDTO
    {
        public int Id { get; set; }
        public DateOnly DataInicio { get; set; }
        public DateOnly DataFim { get; set; }
        public DateOnly? DataDevolucao { get; set; }
        public string QuilometragemInicial { get; set; }
        public string? QuilometragemFinal { get; set; }
        public double ValorDiaria { get; set; }
        public double ValorTotal { get; set; }

        public string ClienteNome { get; set; }
        public string VeiculoModelo { get; set; }
    }

}