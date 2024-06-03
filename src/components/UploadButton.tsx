import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent} from "./ui/dialog";
import Dropzone from "react-dropzone";
import { Cloud, File } from "lucide-react";
import { Progress } from "./ui/progress";
import axios from "axios";

const UploadDropzone = () => {

    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const startSimulateProgress = () => {   

        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress((prevProgress) => {
                prevProgress += 10;
                if(prevProgress >= 95) {
                    clearInterval(interval);
                    return prevProgress;
                }
                return prevProgress + 5;
            })
        }, 50);

        return interval;
    }

    return (
        <Dropzone multiple={false} onDrop={async (acceptedFile) => {
            setIsUploading(true);
            const interval = startSimulateProgress();
            

            try {
                const formData = new FormData();
                formData.append('file', acceptedFile[0]);
                const apiUrl = 'http://localhost:3000/askPDF/uploadPDF';
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    body: formData
                });
        
                console.log('response of upload file', response);
            } catch(error) {
                console.log('error while uploading file', error);
            }

            await new Promise((resolve) => setTimeout(resolve, 1500));
            clearInterval(interval);
            setUploadProgress(100);
            setIsUploading(false);
        }}>
            {
                ({ getRootProps, getInputProps, acceptedFiles}) => (
                    <div {...getRootProps()} className="border h-64 m-4 border-dashed border-gray-300 rounded-lg">
                        <div className="flex items-center justify-center h-full w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer"
                            >   
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Cloud className="h-6 w-6 text-zinc-500 mb-2"></Cloud>
                                    <p className="mb-2 text-sm text-zinc-700">
                                        <span className="font-semibold">Click to upload</span>{' '} or drag and drop
                                    </p>
                                    <p className="text-xs text-zinc-500">PDF (upto 4MB)</p>
                                </div>

                                {acceptedFiles && acceptedFiles[0] ? (
                                    <div className='max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200'>
                                        <div className="px-3 py-2 h-full grid place-items-center">
                                            <File className="h-4 w-4 text-blue-500"></File>
                                        </div>
                                        <div className="px-3 py-2 h-full text-sm truncate">
                                            {acceptedFiles[0].name}
                                        </div>
                                    </div>
                                ) : null}

                                {isUploading ? (
                                    <div className="w-full mt-4 max-w-xs mx-auto">
                                        <Progress 
                                            value={uploadProgress} 
                                            className='h-1 w-full bg-zinc-200'
                                        />
                                    </div>
                                ) : null}

                            </label>
                        </div>
                    </div>
                )
            }
        </Dropzone>
    );
}

const UploadButton = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if(!open) {
                setIsOpen(open);
            }
        }}>
            <DialogTrigger onClick={() => setIsOpen(true)}>
                <Button>Upload PDF</Button>
            </DialogTrigger>

            <DialogContent>
                <UploadDropzone />
            </DialogContent>
        </Dialog>
    );
}

export default UploadButton;