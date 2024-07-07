using Handy.Exceptions;
using System.Text.Json;

namespace Handy.Middleware
{
    public class ErrorHandlingMiddleware : IMiddleware
    {
        private readonly ILogger<ErrorHandlingMiddleware> logger;

        public ErrorHandlingMiddleware(ILogger<ErrorHandlingMiddleware> logger)
        {
            this.logger = logger;
        }

        async Task IMiddleware.InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
               await next.Invoke(context);
            }
            catch (ExceptionBadRequest badReqException)
            {
                context.Response.StatusCode = 400;
                var responseObj = new { message = badReqException.Message };
                var jsonResponse = JsonSerializer.Serialize(responseObj); 
                await context.Response.WriteAsync(jsonResponse);
            }
            catch (NotFoundException notFoundException)
            {
                context.Response.StatusCode = 404;
                await context.Response.WriteAsync(notFoundException.Message);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);

                context.Response.StatusCode = 500;
                await context.Response.WriteAsync("Something went wrong");
            }
        }
    }
}
