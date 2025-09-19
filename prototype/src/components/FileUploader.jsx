import React, { useState } from "react";

function FileUploader({ onProcess }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddLesson = () => {
    if (!text) {
      alert("Please paste some text for the lesson content.");
      return;
    }
    setLoading(true);

    // Call the handler in the parent component.
    onProcess();

    // Reset the component's state.
    setText("");
    setLoading(false);
  };

  return (
    <div className="card">
      <h4>Lesson Content</h4>
      <textarea
        rows="4"
        cols="40"
        placeholder="Paste lesson text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAddLesson} disabled={loading}>
        {loading ? "Adding..." : "Add Lesson"}
      </button>
    </div>
  );
}

export default FileUploader;