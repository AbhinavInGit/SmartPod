import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FileUploader from "./FileUploader";
import allSummaries from "../data/summary.json";
import allQuizzes from "../data/quiz.json";
import { FaCommentDots, FaVideo, FaPhone, FaPaperPlane } from 'react-icons/fa';


function PodView({ pods, onAddLesson, onEnd }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const pod = pods.find((p) => p.id === id);

  // Existing State
  const [topic, setTopic] = useState("");
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState({});

  // --- New Chat State ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "System", text: "Chat session started." }
  ]);

  if (!pod) {
    return <p>Pod not found</p>;
  }

  const handleEnd = () => {
    onEnd(pod.id);
    navigate("/");
  };

  const handleProcessContent = ({ text, isPdf, isImage }) => {
    let summary = text;
    let lessonTopic = topic;
    if (isPdf || isImage) {
      const randomIndex = Math.floor(Math.random() * allSummaries.length);
      const randomLesson = allSummaries[randomIndex];
      lessonTopic = randomLesson.topic;
      summary = randomLesson.summary;
    } else if (!topic) {
      alert("Please enter a Topic Name for the pasted text.");
      return;
    }
    onAddLesson(id, lessonTopic, "AI Summary: " + summary);
    setTopic("");
  };

  const handleGenerateQuiz = async (lessonTopic) => {
    setQuizLoading(true);
    setSelectedAnswers({});
    setScore(0);
    setShowExplanation({});
    try {
      const quizData = allQuizzes[lessonTopic];
      if (quizData) {
        setCurrentQuiz(quizData);
      } else {
        throw new Error(`Quiz not found for topic: ${lessonTopic}`);
      }
    } catch (err) {
      console.error("Error fetching quiz:", err);
      setCurrentQuiz(null);
    }
    setQuizLoading(false);
  };

  const handleAnswerSelect = (qIndex, oIndex, isCorrect) => {
    if (selectedAnswers[qIndex] === undefined) {
      setSelectedAnswers({ ...selectedAnswers, [qIndex]: oIndex });
      if (isCorrect) {
        setScore(score + 1);
      }
      setShowExplanation({ ...showExplanation, [qIndex]: true });
    }
  };

  // --- New Chat Functions ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage = { sender: "You", text: chatInput };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // Auto-reply logic
    if (chatInput.trim().toLowerCase() === "hi") {
      const otherMembers = pod.members.filter(m => m !== "You"); // Assuming 'You' isn't in the list
      const randomMember = otherMembers[Math.floor(Math.random() * otherMembers.length)];
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: randomMember, text: "i have a query" }]);
      }, 1000); // 1-second delay
    }
    
    setChatInput("");
  };

  return (
    <>
      <div className="card">
        <h2>Pod: {pod.name}</h2>
        <p className="members">Members: {pod.members.join(", ")}</p>

        <button onClick={handleEnd} style={{ background: "crimson" }}>
          End Pod
        </button>

        <h3>Add Lesson</h3>
        <input
          type="text"
          placeholder="Enter Custom Topic Name (if pasting text)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{ marginBottom: 'var(--spacing-4)' }}
        />
        <FileUploader onProcess={handleProcessContent} />

        <h3>Lessons</h3>
        {pod.lessons.length === 0 && <p>No lessons yet. Add one using the form above.</p>}
        {pod.lessons.map((lesson, idx) => (
          <div key={idx} className="lesson">
            <h4>{lesson.topic}</h4>
            <p>{lesson.summary}</p>
            <button onClick={() => handleGenerateQuiz(lesson.topic)} disabled={quizLoading}>
              {quizLoading ? "Generating..." : "Generate Quiz"}
            </button>
          </div>
        ))}
        
        {currentQuiz && currentQuiz.questions && (
          <div className="quiz-section">
            <h3>Test Your Knowledge! - Score: {score}/{currentQuiz.questions.length}</h3>
            {/* Quiz rendering logic remains the same */}
            {currentQuiz.questions.map((q, qIndex) => (
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

      {/* --- Floating Chat Button and Chat Box --- */}
      <button className="chat-fab" onClick={() => setIsChatOpen(!isChatOpen)}>
        <FaCommentDots size={24} />
        <span className="notification-badge">1</span>
      </button>

      {isChatOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <h3>Pod Chats</h3>
            <div className="chat-header-icons">
              <button><FaPhone size={18} /></button>
              <button><FaVideo size={20} /></button>
            </div>
          </div>
          <div className="chat-members">
            <strong>Members:</strong> {pod.members.join(", ")}
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === 'You' ? 'sent' : 'received'}`}>
                <strong>{msg.sender}: </strong>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <form className="chat-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit"><FaPaperPlane /></button>
          </form>
        </div>
      )}
    </>
  );
}

export default PodView;