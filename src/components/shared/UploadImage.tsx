import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useDropzone, DropzoneOptions, DropzoneRootProps, DropzoneInputProps, FileWithPath } from 'react-dropzone';

type UploadImageProps = {
  field: (fileName: string) => void,
  imageUrl?: string,
  setImageFilePath:  Dispatch<SetStateAction<File | undefined>>
}

function UploadImage({ field, imageUrl, setImageFilePath }: UploadImageProps) {
  const [fileUrl, setFileUrl] = useState<string>();

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    field(acceptedFiles[0].name)
    setImageFilePath(acceptedFiles[0])
  }, [fileUrl]);

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    accept: {
    "image/*" : ['.png', '.jpeg', '.jpg', '.svg']
    }
   } as DropzoneOptions);

  return (
    <div {...getRootProps() as DropzoneRootProps} 
      className={cn("border p-[2px] md:p-[10px] h-[400px] md:h-[500px] bg-[#1A1A1A] rounded-3xl border-light focus:ring-offset-dark-2 cursor-pointer")}
    >
      <input {...getInputProps()  as DropzoneInputProps} />
      {fileUrl 
        ? (
          <div className="h-[95%]">
            <img src={fileUrl} className='rounded-3xl w-full h-full' alt="image upload" />
          </div>
        ): imageUrl 
          ? (
            <div className="h-[95%]">
              <img src={imageUrl} className='rounded-3xl w-full h-full' alt="image upload" />
            </div>
          ): (
            <div className=''>
              <div></div>
              <div></div>
            </div>
          )
        }
    </div>
  );
}

export default UploadImage