// components/ui/FileUpload.tsx
"use-client";

import React from 'react';

interface FileUploadProps {
    label: string;
    buttonText?: string;
    acceptedTypes?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, buttonText = "Browse File", acceptedTypes }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-gray-800 mb-1">{label}</label>
        <div className="relative">
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="w-full bg-white text-sm text-gray-500 px-3 py-1 rounded-sm border border-gray-400">
                {buttonText}
            </div>
        </div>
        {acceptedTypes && <p className="text-xs text-gray-600 mt-1">{acceptedTypes}</p>}
    </div>
);

export default FileUpload;