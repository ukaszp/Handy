using System;
using System.IO;
using System.Threading.Tasks;
using Handy.Api.Entities;
using Handy.Data;
using Handy.Entities;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using UploadThing.Core;

public class PhotoService : IPhotoService
{
    private readonly Uploader _uploader;
    AppDbContext dbContext;

    public PhotoService(string secret, AppDbContext dbContext)
    {
        var options = new UploadThingOptions(UPLOADTHING_SECRET: secret);
        _uploader = new Uploader(options)
            .MaxSize(10) // 10 MB
            .Middleware(req =>
            {
                /*  if (user == null)
                      throw new Exception("User not authenticated");*/

                return new { message = "a great big metadata" };
            })
            .OnUploadPrepare(file =>
            {
                Console.WriteLine("URL: " + file.Url);
                Console.WriteLine("Name: " + file.Name);
                Console.WriteLine("Metadata: " + JsonConvert.SerializeObject(file.Metadata));
            })
            .OnUploadComplete(file =>
            {
                Console.WriteLine("It's uploaded to S3.");
            });
        this.dbContext = dbContext;
    }

    public async Task<Photo> UploadFileAsync(Stream fileStream, string fileName)
    {
        if (fileStream == null) throw new ArgumentNullException(nameof(fileStream));
        if (string.IsNullOrWhiteSpace(fileName)) throw new ArgumentNullException(nameof(fileName));

        var fileDetails = new FileDetails(
            FileName: fileName,
            FileType: UtUtils.GetFileType(fileName),
            CallbackSlug: "ut_example_console",
            CallbackUrl: "http://localhost:7000/api/upload/callback"
            );


        var utFile = await _uploader.UploadAsync(fileStream, fileDetails);

        string uploadedFilePath = $"https://example.com/uploaded/{fileName}";


        var uploadedPhoto = new Photo
        {
            Url = utFile
        };

        dbContext.Add(uploadedPhoto);
        dbContext.SaveChanges();

        return uploadedPhoto;
    }

    public async Task<bool> DeletePhotoAsync(int photoId)
    {
        var photo = await dbContext.Photos.FindAsync(photoId);
        if (photo == null)
        {
            return false;
        }

        dbContext.Photos.Remove(photo);

        await dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<List<Photo>> GetPhotosByIdsAsync(List<int> photoIds)
    {
        return await dbContext.Photos
            .Where(d => photoIds.Contains(d.Id))
            .ToListAsync();
    }
}
