"use client";

import React, { useEffect, useRef, useState } from "react";
import ImagePreview from "@/components/upload/ImagePreview";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa6";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";
import { useFileContext } from "@/context/FileContext";
import { CiCirclePlus } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import { securePdfFormSchema } from "@/schema";
import { z } from "zod";
import { HiLockOpen } from "react-icons/hi";
import Header from "../header";

const ConvertToPdf = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const firstPdfFileName = useRef<string>("");
  const router = useRouter();
  const { files, setFiles } = useFileContext();
  

  useEffect(() => {
    if (files.length === 0) {
      router.push("/");
    }
  }, [router, files]);

  const handleAddImageClick = () => {
    console.log("add image clicked");
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = [...files, ...Array.from(selectedFiles)];
      setFiles(fileArray);
      setPdfUrl(null);
    }
  };

  const handleConvertToPdf = async (
    isSecured: boolean,
    values?: z.infer<typeof securePdfFormSchema>
  ) => {
    let pdf: jsPDF = new jsPDF();

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    const padding = 10; // Padding from the edges

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (i == 0) {
        firstPdfFileName.current = file.name.split(".")[0];
      }
      const imgData = await readFileAsDataURL(file);
      const img = new window.Image();
      img.src = imgData;

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const imgWidth = img.width;
          const imgHeight = img.height;
          const aspectRatio = imgWidth / imgHeight;

          let finalWidth = width - 2 * padding;
          let finalHeight = finalWidth / aspectRatio;

          if (finalHeight > height - 2 * padding) {
            finalHeight = height - 2 * padding;
            finalWidth = finalHeight * aspectRatio;
          }

          const x = (width - finalWidth) / 2;
          const y = (height - finalHeight) / 2;

          pdf.addImage(img, "JPEG", x, y, finalWidth, finalHeight);
          if (i < files.length - 1) {
            pdf.addPage();
          }
          resolve();
        };
      });
    }

    // simple logic without password protect
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
    
  };


  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Convert Image to PDF</h1>
        </div>
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {files.map((file, index) => (
            <ImagePreview key={file.name + index} file={file} />
          ))}
          <div
            className="flex flex-col justify-center items-center border border-gray-400 rounded-full p-6 bg-gray-400 hover:bg-slate-300 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={handleAddImageClick}
          >
            <CiCirclePlus size={28} color="white" />
            <div className="text-xs text-white mt-2">Add Images</div>
          </div>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            multiple
          />
        </div>
        <div className="flex flex-col gap-4 justify-center items-center mt-6">
          {!pdfUrl && (
            <div className="flex justify-center items-center">
              <Button
                className="flex items-center px-6 py-3 mx-5 text-white bg-red-500 rounded-md shadow-lg hover:bg-red-600 transition-all duration-300"
                onClick={() => handleConvertToPdf(false)}
              >
                <HiLockOpen size={20} className="mr-2" />
                Convert
                <FaArrowRight size={20} className="ml-2" />
              </Button>
            </div>
          )}
          {pdfUrl && (
            <a
              href={pdfUrl}
              download={`${firstPdfFileName.current}_merged.pdf`}
              className="block px-6 py-3 mt-4 text-white bg-blue-500 rounded-md shadow-lg hover:bg-blue-600 transition-all duration-300"
            >
              Download PDF
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default ConvertToPdf;
