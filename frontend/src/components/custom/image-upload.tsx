import axios, { AxiosProgressEvent, CancelTokenSource } from "axios";
import {
  AudioWaveform,
  File,
  FileImage,
  FolderArchive,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { AxiosError } from "axios";
import usePhotoStore from "@/stores/usePhotoStore";
import { Photo } from "@/data/Photo";
interface FileUploadProgress {
  progress: number;
  File: File;
  source: CancelTokenSource | null;
}

enum FileTypes {
  Image = "image",
  Pdf = "pdf",
  Audio = "audio",
  Video = "video",
  Other = "other",
}

const ImageColor = {
  bgColor: "bg-purple-600",
  fillColor: "fill-purple-600",
};

const PdfColor = {
  bgColor: "bg-blue-400",
  fillColor: "fill-blue-400",
};

const AudioColor = {
  bgColor: "bg-yellow-400",
  fillColor: "fill-yellow-400",
};

const VideoColor = {
  bgColor: "bg-green-400",
  fillColor: "fill-green-400",
};

const OtherColor = {
  bgColor: "bg-gray-400",
  fillColor: "fill-gray-400",
};

export default function ImageUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);
  const { uploadPhoto, deletePhoto, photos, addPhoto } = usePhotoStore();

  const getFileIconAndColor = (file: File) => {
    if (file.type.includes(FileTypes.Image)) {
      return {
        icon: <FileImage size={40} className={ImageColor.fillColor} />,
        color: ImageColor.bgColor,
      };
    }
  };

  const removeFile = (file: File) => {
    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.filter((item) => item.File !== file);
    });

    setUploadedFiles((prevUploadedFiles) => {
      return prevUploadedFiles.filter((item) => item !== file);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFilesToUpload((prev) => [
        ...prev,
        ...acceptedFiles.map((file) => ({
          progress: 0,
          File: file,
          source: null,
        })),
      ]);

      acceptedFiles.forEach((file) => {
        const source = axios.CancelToken.source();

        uploadPhoto(file)
          .then((response) => {
            addPhoto(response);

            setUploadedFiles((prev) => [...prev, file]);
            setFilesToUpload((prev) =>
              prev.filter((item) => item.File !== file)
            );
          })
          .catch((error: AxiosError) => {
            console.error("Upload failed", error);
          });

        setFilesToUpload((prev) =>
          prev.map((item) => (item.File === file ? { ...item, source } : item))
        );
      });
    },
    [uploadPhoto, addPhoto]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div>
        <label
          {...getRootProps()}
          className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
        >
          <div className=" text-center">
            <div className=" border p-2 rounded-md max-w-min mx-auto">
              <UploadCloud size={20} />
            </div>

            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Przeciągnij pliki</span>
            </p>
            <p className="text-xs text-gray-500">
              Kliknij aby przesłać pliki &#40;pliki powinny ważyć poniżej 10 MB
              &#41;
            </p>
          </div>
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg"
          type="file"
          className="hidden"
        />
      </div>

      {filesToUpload.length > 0 && (
        <div>
          <ScrollArea className="h-40">
            <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
              Przesyłanie
            </p>
            <div className="space-y-2 pr-3">
              {filesToUpload.map((fileUploadProgress) => {
                return (
                  <div
                    key={fileUploadProgress.File.lastModified}
                    className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2"
                  >
                    <div className="flex items-center flex-1 p-2">
                      <div className="text-white"></div>

                      <div className="w-full ml-2 space-y-1">
                        <div className="text-sm flex justify-between">
                          <p className="text-muted-foreground ">
                            {fileUploadProgress.File.name.slice(0, 25)}
                          </p>
                          <span className="text-xs">
                            {fileUploadProgress.progress}%
                          </span>
                        </div>
                        <Progress value={fileUploadProgress.progress} />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (fileUploadProgress.source)
                          fileUploadProgress.source.cancel("Upload cancelled");
                        removeFile(fileUploadProgress.File);
                      }}
                      className="bg-red-500 text-white transition-all items-center justify-center cursor-pointer px-2 hidden group-hover:flex"
                    >
                      <X size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {photos.length > 0 && (
        <div>
          <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
            Przesłano
          </p>
          <div className="flex pr-3">
            {photos.map((photo) => {
              return (
                <div
                  key={photo.id}
                  className="flex-col justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2 hover:border-slate-300 transition-all"
                >
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="bg-gray-700 text-white transition-all w-full items-center justify-center px-2 hidden group-hover:flex"
                  >
                    <X size={20} />
                  </button>
                  <img src={photo.url} alt="" className="max-w-20 rounded-md" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
