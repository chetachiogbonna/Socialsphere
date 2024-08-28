import { cn } from '@/lib/utils';
import { useCallback, useState } from 'react';
import { DropzoneInputProps, DropzoneOptions, DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';

type ProfileUploadImageProps = { 
  className: string, 
  subClassName: string,
  imageUrl?: string,
  field: (fileName: string) => void,
  pic?: boolean,
  setImageFilePath: React.Dispatch<React.SetStateAction<File | undefined>>
}

function ProfileUploadImage({ className, subClassName, imageUrl, field, pic=false,setImageFilePath }: ProfileUploadImageProps) {
  const [fileUrl, setFileUrl] = useState<string>();

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    setImageFilePath(acceptedFiles[0]);
    field(acceptedFiles[0].name)
  }, [fileUrl]);

  const { getRootProps, getInputProps } = useDropzone({ 
  onDrop,
  accept: {
  "image/*": ['.png', '.jpeg', '.jpg', '.svg']
  }
  } as DropzoneOptions);

  return (
    <div {...getRootProps() as DropzoneRootProps} className={className}>
      <input {...getInputProps()  as DropzoneInputProps} />
      {fileUrl || imageUrl
        ? (
            <div className={cn("bg-dark-5 w-full h-full rounded-3xl relative cursor-pointer", { "rounded-full": pic }, subClassName)}>
              <img src={fileUrl} className={subClassName} alt="image upload" />
              {pic ? 
                  <Button 
                  type="button"
                    className="absolute bottom-3 right-0 p-1 bg-light hover:bg-light w-8 h-8 rounded-full">
                    <img className="change-icon rounded" src="/assets/icons/edit.svg" width={20} height={20} alt="" />
                  </Button>
                : (
                  <Button 
                    className="mr-3 absolute top-20 right-3 bg-opacity-70 bg-dark-3 hover:opacity-70"
                    type="button"
                  >
                    Change
                    <img className="change-icon ml-2" src="/assets/icons/edit.svg" width={24} height={24} />
                  </Button>
                )
              }
            </div>
        ): (
            <div className={cn("bg-dark-5 w-full h-full rounded-3xl relative flex justify-end items-center cursor-pointer", { "rounded-full flex justify-center items-center": pic })}>
              {pic ? 
                  <img className="change-icon" src="/assets/icons/camera.svg" width={30} height={30} />
                : (
                  <Button 
                    className="mr-3"
                    type="button"
                  >
                    Choose cover photo
                    <img className="change-icon ml-2" src="/assets/icons/camera.svg" width={30} height={30} />
                  </Button>
                )
              }
            </div>
          )
      }
    </div>
  )
}

export default ProfileUploadImage