import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import axios from 'axios';

interface FaviconUploadProps {
  currentUrl?: string;
  onUploadSuccess: (url: string) => void;
}

export default function FaviconUpload({ currentUrl, onUploadSuccess }: FaviconUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Show preview for PNG
    if (file.type === 'image/png') {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('favicon', file);

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/admin/site-config/favicon', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      onUploadSuccess(response.data.faviconUrl);
      alert('Favicon uploaded successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Upload failed');
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  }, [currentUrl, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/x-icon': ['.ico'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    maxSize: 100 * 1024, // 100KB
  });

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Favicon
      </label>

      {/* Preview */}
      {preview && (
        <div className="relative inline-block p-4 border rounded-lg bg-white">
          <img
            src={preview}
            alt="Favicon preview"
            className="h-16 w-16"
          />
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} disabled={uploading} />
        {uploading ? (
          <>
            <div className="animate-spin h-12 w-12 mx-auto border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="mt-2 text-sm text-blue-600">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive ? 'Drop here...' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-gray-500 mt-1">ICO or PNG, max 100KB</p>
          </>
        )}
      </div>
    </div>
  );
}
