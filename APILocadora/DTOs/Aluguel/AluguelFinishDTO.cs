namespace APILocadora.DTOs.Aluguel
{
    public class AluguelFinishDTO
    {   
        public DateOnly? DataDevolucao { get; set; }
        public string QuilometragemFinal { get; set; }
    }
}