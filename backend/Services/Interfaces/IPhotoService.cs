using Handy.Api.Entities;

public interface IPhotoService
{
    Task<Photo> UploadFileAsync(Stream fileStream, string fileName);
    Task<bool> DeletePhotoAsync(int photoId);
    Task<List<Photo>> GetPhotosByIdsAsync(List<int> photoIds);
}
