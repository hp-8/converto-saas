"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaFileUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useFileContext } from "@/context/FileContext";

const UploadInput = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setFiles } = useFileContext();
  const [isDragging, setIsDragging] = useState(false);

  const handleButtonClick = () => {
    setFiles([]);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles(fileArray);
      //   sessionStorage.setItem('files', JSON.stringify(fileArray));
      router.push("/convert-to-pdf");
    }
  };

  // New drag event handlers
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      const fileArray = Array.from(droppedFiles);
      setFiles(fileArray);
      //   sessionStorage.setItem('files', JSON.stringify(fileArray));
      router.push("/convert-to-pdf");
    }
    setIsDragging(false);
  };

  return (
    <div
      className={`flex flex-col gap-4 items-center justify-center my-5 p-6 border-2 border-dashed ${
        isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    > 
      <Button
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        onClick={handleButtonClick}
      >
        <span className="mx-2">
          <FaFileUpload color="white" size={20} />
        </span>
        Upload Images
      </Button>
    <p className="text-gray-300">Drag and drop your files here.</p>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple
      />
      {isDragging && (
        <p className="mt-2 text-blue-500">Drop files here to upload</p>
      )}
    </div>
  );
};

export default UploadInput;
