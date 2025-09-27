import React, { useState, useRef } from "react";
import { FaFileUpload, FaImage, FaPaste } from 'react-icons/fa';

function FileUploader({ onProcess }) {
  const [inputType, setInputType] = useState("text"); // 'text', 'pdf', 'image'
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const resetState = () => {
    setText("");
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setLoading(false);
  };

  const handleAddLesson = () => {
    if (!text && !selectedFile) {
      alert("Please provide some content.");
      return;
    }
    setLoading(true);
    onProcess({
      text,
      isPdf: inputType === 'pdf' && selectedFile,
      isImage: inputType === 'image' && selectedFile,
    });
    resetState();
  };

  const triggerFileSelect = () => fileInputRef.current.click();

  const renderInputArea = () => {
    switch (inputType) {
      case "pdf":
        return (
          <div className="upload-area" onClick={triggerFileSelect}>
            <FaFileUpload size={50} />
            <p>Click to Upload a PDF</p>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>
        );
      case "image":
        return (
          <div className="upload-area" onClick={triggerFileSelect}>
            <FaImage size={50} />
            <p>Click to Upload an Image</p>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        );
      case "text":
      default:
        return (
          <textarea
            rows="6"
            placeholder="Paste lesson text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="file-uploader-card">
      <h4>Lesson Content</h4>
      <div className="input-type-selector">
        <button onClick={() => setInputType('text')} className={inputType === 'text' ? 'active' : ''}>
          <FaPaste /> Paste Text
        </button>
        <button onClick={() => setInputType('pdf')} className={inputType === 'pdf' ? 'active' : ''}>
          <FaFileUpload /> Upload PDF
        </button>
        <button onClick={() => setInputType('image')} className={inputType === 'image' ? 'active' : ''}>
          <FaImage /> Upload Image
        </button>
      </div>

      <div className="input-content-area">
        {renderInputArea()}
        {selectedFile && (
          <div className="upload-progress-section">
            <p>Selected: {selectedFile.name}</p>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress > 0 && `${uploadProgress}%`}
              </div>
            </div>
          </div>
        )}
      </div>

      <button onClick={handleAddLesson} disabled={loading} className="add-lesson-btn">
        {loading ? "Adding..." : "Add Lesson"}
      </button>
    </div>
  );
}

export default FileUploader;