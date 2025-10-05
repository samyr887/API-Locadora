namespace APILocadora.Models
{
    public class Fabricante
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
       
        public ICollection<Veiculo> Veiculos { get; set; }
    }
}
