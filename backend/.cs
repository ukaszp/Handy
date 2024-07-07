using Newtonsoft.Json;

public static class JsonHelper
{
    public static string SerializeObjectWithFormatting(object obj)
    {
        var settings = new JsonSerializerSettings
        {
            Formatting = Formatting.Indented,
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            NullValueHandling = NullValueHandling.Ignore
        };

        return JsonConvert.SerializeObject(obj, settings);
    }
}
