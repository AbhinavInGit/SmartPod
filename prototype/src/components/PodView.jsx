import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FileUploader from "./FileUploader";

function PodView({ pods, onAddLesson, onEnd }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const pod = pods.find((p) => p.id === id);

  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState({});

  if (!pod) {
    return <p>Pod not found</p>;
  }

  const handleEnd = () => {
    onEnd(pod.id);
    navigate("/");
  };
  
  // This function is called by the FileUploader component
  const handleAddLesson = async () => {
    if (!topic) {
      alert("Please enter a Topic Name.");
      return;
    }
    try {
      const res = await fetch("/src/data/summary.json");
      if (!res.ok) throw new Error("Failed to fetch summary");
      const data = await res.json();
      
      // Adds a new lesson using the user's topic and the summary from the JSON file
      onAddLesson(id, topic, "AI Summary: " + data.summary);
      
      // Clears the topic input field for the next entry
      setTopic("");
    } catch (err) {
      console.error("Error adding lesson:", err);
    }
  };

  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    // ... (rest of the function is unchanged)
    try {
      const res = await fetch("/src/data/quiz.json");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setQuiz(data);
    } catch (err) {
      console.error("Error fetching quiz:", err);
    }
    setQuizLoading(false);
  };

  const handleAnswerSelect = (qIndex, oIndex, isCorrect) => {
    // ... (this function is unchanged)
    if (selectedAnswers[qIndex] === undefined) {
      setSelectedAnswers({ ...selectedAnswers, [qIndex]: oIndex });
      if (isCorrect) {
        setScore(score + 1);
      } else {
        setShowExplanation({ ...showExplanation, [qIndex]: true });
      }
    }
  };

  return (
    <div className="card">
      <h2>Pod: {pod.name}</h2>
      <p className="members">Members: {pod.members.join(", ")}</p>

      <button onClick={handleEnd} style={{ background: "crimson" }}>
        End Pod
      </button>

      {/* This section is now fully functional */}
      <h3>Add Topic</h3>
      <input
        type="text"
        placeholder="Topic Name"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <FileUploader onProcess={handleAddLesson} />

      <h3>Lessons</h3>
      {pod.lessons.length === 0 && <p>No lessons yet. Add one using the form above.</p>}
      {pod.lessons.map((lesson, idx) => (
        <div key={idx} className="lesson">
          <h4>{lesson.topic}</h4>
          <p>{lesson.summary}</p>
          <button onClick={handleGenerateQuiz} disabled={quizLoading}>
            {quizLoading ? "Generating..." : "Generate Quiz"}
          </button>
        </div>
      ))}
      
      {quiz && quiz.questions && (
        <div className="quiz-section">
          <h3>Test Your Knowledge! - Score: {score}/{quiz.questions.length}</h3>
          {quiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="question-card">
              <p><strong>{q.question}</strong></p>
              <div className="options">
                {q.options.map((opt, oIndex) => {
                  const isSelected = selectedAnswers[qIndex] === oIndex;
                  let buttonClass = "";
                  if (isSelected) {
                    buttonClass = opt.isCorrect ? "correct" : "incorrect";
                  }
                  return (
                    <button
                      key={oIndex}
                      className={`option-btn ${buttonClass}`}
                      onClick={() => handleAnswerSelect(qIndex, oIndex, opt.isCorrect)}
                      disabled={selectedAnswers[qIndex] !== undefined}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              {showExplanation[qIndex] && <p className="explanation">Explanation: {q.explanation}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PodView;