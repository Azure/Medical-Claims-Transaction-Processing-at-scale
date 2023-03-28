namespace CoreClaims.Infrastructure.Domain.Entities
{
    public class Author
    {
        public Author(string type, string name)
        {
            Type = type;
            Name = name;
        }
        
        public string Type { get; }

        public string Name { get; }

        public static Author Adjudicator(string adjudicator) => new("Adjudicator", adjudicator);

        public static Author System(string trigger) => new("System", trigger);

        public static Author Member(string member) => new("Member", member);
    }
}
