"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onImageSelect: (file: File | null, previewUrl: string) => void;
  currentImageUrl?: string;
  className?: string;
}

export default function ImageUpload({ 
  onImageSelect, 
  currentImageUrl, 
  className = "" 
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('O arquivo deve ter no máximo 5MB.');
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreviewUrl(url);
      onImageSelect(file, url);
      setIsLoading(false);
    };
    
    reader.onerror = () => {
      alert('Erro ao ler o arquivo.');
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleRemoveImage = useCallback(() => {
    setPreviewUrl("");
    onImageSelect(null, "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onImageSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Capa do Livro
      </label>
      
      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200 hover:border-blue-400 hover:bg-gray-800/50
          ${isDragOver 
            ? 'border-blue-400 bg-blue-900/20' 
            : 'border-gray-600 bg-gray-800/30'
          }
          ${isLoading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-2"></div>
            <p className="text-sm text-gray-400">Processando imagem...</p>
          </div>
        ) : previewUrl ? (
          <div className="relative">
            <div className="relative w-32 h-48 mx-auto mb-4">
              <Image
                src={previewUrl}
                alt="Preview da capa"
                fill
                className="object-cover rounded-lg shadow-lg"
                onError={() => {
                  setPreviewUrl("");
                  onImageSelect(null, "");
                }}
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              title="Remover imagem"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-sm text-gray-400">
              Clique para alterar ou arraste uma nova imagem
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-gray-700 rounded-full p-4 mb-4">
              {isDragOver ? (
                <Upload className="h-8 w-8 text-blue-400" />
              ) : (
                <ImageIcon className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <p className="text-lg font-medium text-gray-300 mb-2">
              {isDragOver ? 'Solte a imagem aqui' : 'Adicionar capa do livro'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Arraste e solte uma imagem ou clique para selecionar
            </p>
            <div className="text-xs text-gray-600">
              <p>Formatos aceitos: JPG, PNG, GIF</p>
              <p>Tamanho máximo: 5MB</p>
            </div>
          </div>
        )}
      </div>

      {/* URL Input Alternative */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-900 text-gray-400">ou</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          URL da imagem
        </label>
        <input
          type="url"
          placeholder="https://exemplo.com/capa-do-livro.jpg"
          value={previewUrl.startsWith('data:') ? '' : previewUrl}
          onChange={(e) => {
            const url = e.target.value;
            setPreviewUrl(url);
            onImageSelect(null, url);
          }}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

