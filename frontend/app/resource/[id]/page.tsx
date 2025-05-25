'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Resource {
  _id: string;
  title: string;
  description: string;
  file_type: string;
  file_url?: string;
  external_link?: string;
  categories: string[];
  tags: string[];
  uploaded_at: string;
}

export default function ResourcePage() {
  const { id } = useParams();
  const [resource, setResource] = useState<Resource | null>(null);
  const [codeContent, setCodeContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setError('');
    setResource(null);
    setCodeContent('');

    const fetchResource = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/resources/${id}`);
        const text = await res.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error('Invalid JSON response from backend.');
        }

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to fetch resource');
        }

        setResource(data);

        const url = data.file_url || data.external_link;
        if (
          url &&
          ['code', 'text', 'txt'].includes(data.file_type.toLowerCase())
        ) {
          const codeRes = await fetch(url);
          if (!codeRes.ok) {
            throw new Error('Failed to fetch text content.');
          }
          const code = await codeRes.text();
          setCodeContent(code);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        console.error(err);
      }
    };

    fetchResource();
  }, [id]);

  if (error) {
    return <p className="p-4 text-center text-red-600">{error}</p>;
  }

  if (!resource) {
    return <p className="p-4 text-center">Loading...</p>;
  }

  const url = resource.file_url || resource.external_link;
  const fileType = resource.file_type.toLowerCase();

  const isValidUrl = (str?: string) => {
    if (!str) return false;
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const renderContent = () => {
    switch (fileType) {
      case 'image':
        // Show image inline if valid URL
        if (isValidUrl(url)) {
          return (
            <img
              src={url!}
              alt={resource.title}
              className="max-w-full h-auto rounded"
            />
          );
        } else {
          return <p>Image not available.</p>;
        }

      case 'pdf':
        // For PDF, show download link if URL valid
        if (isValidUrl(url)) {
          return (
            <a
              href={url!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
              download
            >
              Download PDF
            </a>
          );
        } else {
          return <p>PDF not available.</p>;
        }

      case 'code':
      case 'text':
      case 'txt':
        // Show text content inline if loaded, else loading msg
        if (codeContent) {
          return (
            <pre className="bg-gray-900 text-white p-4 rounded overflow-x-auto whitespace-pre-wrap">
              <code>{codeContent}</code>
            </pre>
          );
        } else if (url && isValidUrl(url)) {
          return <p>Loading text content...</p>;
        } else {
          return <p>Text file not available.</p>;
        }

      case 'link':
        // Show clickable external link if valid
        if (isValidUrl(url)) {
          return (
            <a
              href={url!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Open External Link
            </a>
          );
        } else {
          return <p>Link not available.</p>;
        }

      default:
        // For all other types, show download link if URL valid
        if (isValidUrl(url)) {
          return (
            <a
              href={url!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
              download
            >
              Download File
            </a>
          );
        } else {
          return <p>File not available for preview or download.</p>;
        }
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{resource.title}</h1>
      <p className="mb-4 text-gray-700">{resource.description}</p>
      <div className="border rounded p-4 bg-white shadow">{renderContent()}</div>
    </div>
  );
}
