// components/ui/FileUpload.tsx
"use-client";

import React, { useState } from 'react';

interface FileUploadProps {
    label: string;
    buttonText?: string;
    acceptedTypes?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, buttonText = "Browse File", acceptedTypes }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    };

    return (
        <div className="mb-4">
            <label className="block text-xs font-bold text-white mb-1">{label}</label>
            <div className="relative">
                <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className={`w-full max-w-40 text-sm px-3 py-1 rounded-sm border ${
                    selectedFile ? 'bg-[#00FF4C] text-black border-[#00FF4C]' : 'bg-white text-gray-500 border-gray-400'
                }`}>
                    {selectedFile ? 'Uploaded' : buttonText}
                </div>
            </div>
            {acceptedTypes && <p className="text-xs text-white mt-1">{acceptedTypes}</p>}
        </div>
    );
};

export default FileUpload;