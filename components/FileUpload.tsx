
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    onFileSelect(file);
    // Reset file input to allow uploading the same file again
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/50 hover:border-blue-500 hover:bg-gray-800 transition-all duration-300">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="audio/mp3, audio/mpeg, audio/wav, audio/x-wav"
        disabled={disabled}
      />
      <button
        onClick={handleButtonClick}
        disabled={disabled}
        className="flex flex-col items-center justify-center text-center px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <UploadIcon className="w-12 h-12 mb-3 text-gray-400"/>
        <span className="font-semibold text-lg text-white">Click to upload an audio file</span>
        <span className="text-sm text-gray-400 mt-1">MP3 or WAV</span>
      </button>
    </div>
  );
};
