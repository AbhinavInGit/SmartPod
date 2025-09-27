import React, { useState } from "react";
import FileUploader from "./FileUploader";
import learningData from "../data/microlearning.json";

function Microlearning() {
  const [activeQuiz, setActiveQuiz] = useState(null); // ID of the chunk with the active quiz
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [showExplanations, setShowExplanations] = useState({});

  const handleProcessUpload = () => {
    // In a real app, this would process the uploaded file.
    // For the prototype, we can just show an alert.
    alert("File processing initiated! Content will be generated below.");
  };

  const toggleQuiz = (chunkId) => {
    setActiveQuiz(activeQuiz === chunkId ? null : chunkId);
    // Reset state when opening a new quiz
    setSelectedAnswers({});
    setShowExplanations({});
  };

  const handleAnswerSelect = (chunkId, qIndex, isCorrect) => {
    if (selectedAnswers[qIndex] === undefined) {
      setSelectedAnswers({ ...selectedAnswers, [qIndex]: true });
      if (isCorrect) {
        setScores({ ...scores, [chunkId]: (scores[chunkId] || 0) + 1 });
      }
      setShowExplanations({ ...showExplanations, [qIndex]: true });
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>🔬 Adaptive Microlearning</h2>
        <p>Upload a document, and we'll break it down into bite-sized learning chunks with quizzes.</p>
        <FileUploader onProcess={handleProcessUpload} />
      </div>

      <div className="card">
        <h3>Generated Learning Path: {learningData.title}</h3>
        {learningData.chunks.map((chunk) => (
          <div key={chunk.id} className="learning-chunk">
            <p>{chunk.content}</p>
            <button onClick={() => toggleQuiz(chunk.id)}>
              {activeQuiz === chunk.id ? "Close Quiz" : "Take Quiz"}
            </button>

            {activeQuiz === chunk.id && (
              <div className="quiz-section">
                <h4>
                  Quiz - Score: {scores[chunk.id] || 0}/{chunk.quiz.questions.length}
                </h4>
                {chunk.quiz.questions.map((q, qIndex) => (
                  <div key={qIndex} className="question-card">
                    <p><strong>{q.question}</strong></p>
                    <div className="options">
                      {q.options.map((opt, oIndex) => {
                        const isSelected = selectedAnswers[qIndex];
                        let buttonClass = "";
                        if (isSelected) {
                          buttonClass = opt.isCorrect ? "correct" : "incorrect";
                        }
                        return (
                          <button
                            key={oIndex}
                            className={`option-btn ${buttonClass}`}
                            onClick={() => handleAnswerSelect(chunk.id, qIndex, opt.isCorrect)}
                            disabled={isSelected}
                          >
                            {opt.text}
                          </button>
                        );
                      })}
                    </div>
                    {showExplanations[qIndex] && <p className="explanation">Explanation: {q.explanation}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Microlearning;