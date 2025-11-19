import { useState, useEffect } from 'react';
import { X, FileText, Download, Trash2, Eye, File, Image as ImageIcon, Upload, Plus } from 'lucide-react';
import { documentsAPI } from '../services/api';

export default function UserDocuments({ userId, username, onClose }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [userId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentsAPI.getUserDocuments(userId);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error loading documents:', error);
      alert('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (doc) => {
    setViewingDoc(doc);
    setShowViewer(true);
  };

  const handleDownload = async (doc) => {
    try {
      const response = await documentsAPI.downloadDocument(doc.id);
      
      // Create blob from response
      const blob = new Blob([response.data], { type: doc.file_type || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document');
    }
  };

  const handleDelete = async (doc) => {
    if (!confirm(`Are you sure you want to delete "${doc.filename}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await documentsAPI.deleteDocument(doc.id);
      alert('Document deleted successfully');
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    loadDocuments();
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <ImageIcon size={20} className="text-blue-600" />;
    } else if (ext === 'pdf') {
      return <FileText size={20} className="text-red-600" />;
    }
    return <File size={20} className="text-gray-600" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">User Documents</h2>
              <p className="text-gray-600 mt-1">Documents for {username}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Upload size={18} />
                <span>Upload Document</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No documents found</p>
                <p className="text-gray-500 text-sm mt-2">This user hasn't uploaded any documents yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="mt-1">
                          {getFileIcon(doc.filename)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 truncate">
                            {doc.filename}
                          </h3>
                          <div className="mt-2 space-y-1">
                            {doc.category && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Category:</span>{' '}
                                <span className="capitalize">{doc.category}</span>
                              </p>
                            )}
                            {doc.description && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Description:</span> {doc.description}
                              </p>
                            )}
                            <p className="text-sm text-gray-500">
                              Uploaded: {formatDate(doc.uploaded_at)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleView(doc)}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Document"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download Document"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {showViewer && viewingDoc && (
        <DocumentViewer
          document={viewingDoc}
          onClose={() => {
            setShowViewer(false);
            setViewingDoc(null);
          }}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadDocumentModal
          userId={userId}
          username={username}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </>
  );
}

// Document Viewer Component
function DocumentViewer({ document, onClose }) {
  const [loading, setLoading] = useState(true);
  const viewUrl = `http://localhost:8000/api/admin/documents/view/${document.id}`;
  
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(
    document.filename.split('.').pop().toLowerCase()
  );
  const isPDF = document.filename.split('.').pop().toLowerCase() === 'pdf';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 truncate flex-1 mr-4">
            {document.filename}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        {/* Viewer Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {isImage ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={viewUrl}
                alt={document.filename}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  alert('Failed to load image');
                }}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : isPDF ? (
            <iframe
              src={viewUrl}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                alert('Failed to load PDF');
              }}
              className="w-full h-full min-h-[600px] border-0"
              title={document.filename}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <File size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-700 text-lg mb-2">Preview not available</p>
                <p className="text-gray-500 mb-4">This file type cannot be previewed in the browser.</p>
                <button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Upload Document Modal Component
function UploadDocumentModal({ userId, username, onClose, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      await documentsAPI.uploadDocument(
        userId,
        selectedFile,
        category || null,
        description || null
      );
      alert('Document uploaded successfully');
      onSuccess();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert(error.response?.data?.detail || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Upload Document</h2>
            <p className="text-gray-600 mt-1">Upload a document for {username}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={uploading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleUpload} className="p-6">
          {/* File Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {selectedFile ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <FileText size={48} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <Upload size={48} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">
                    Drag and drop your file here, or
                  </p>
                  <label className="inline-block mt-2">
                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer underline font-medium">
                      browse
                    </span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, Images (JPG, PNG, GIF, WEBP), Documents
                </p>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category (Optional)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="cv">CV/Resume</option>
              <option value="certificate">Certificate</option>
              <option value="id">ID Document</option>
              <option value="contract">Contract</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Add a description for this document..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
              disabled={uploading || !selectedFile}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={20} />
                  <span>Upload Document</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}