using System.Runtime.Serialization;

namespace Handy.Exceptions
{
    [Serializable]
    public class ExceptionBadRequest : Exception
    {

        public ExceptionBadRequest(string? message) : base(message)
        {
        }
    }
}