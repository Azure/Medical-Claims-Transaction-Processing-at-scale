namespace CoreClaims.WebAPI.Components
{
    public class EndpointsBase
    {
        public required string UrlFragment;
        protected ILogger Logger = null!;

        public virtual void AddRoutes(WebApplication app)
        {
        }
    }
}
