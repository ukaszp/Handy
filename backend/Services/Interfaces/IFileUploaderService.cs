
public interface IFileUploaderService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName);
}