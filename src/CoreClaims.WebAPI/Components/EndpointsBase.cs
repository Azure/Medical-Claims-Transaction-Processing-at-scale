namespace CoreClaims.WebAPI.Components
{
    public class EndpointsBase
    {
        public string UrlFragment;
        protected ILogger Logger;

        public virtual void AddRoutes(WebApplication app)
        {
        }
    }
}
