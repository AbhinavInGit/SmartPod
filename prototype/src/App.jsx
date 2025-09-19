import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import PodSection from "./components/PodSection";
import PodView from "./components/PodView";
import Navbar from "./components/Navbar"; // Import the Navbar

// This layout component checks the route and conditionally renders the Navbar
const PageLayout = ({ children }) => {
  const location = useLocation();
  const showNavbar = location.pathname === '/' || location.pathname === '/create';

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  const [pods, setPods] = useState([]);

  const createPod = (name, members) => {
    const newPod = {
      id: `pod${pods.length + 1}`,
      name,
      members,
      lessons: []
    };
    setPods([...pods, newPod]);
    return newPod.id;
  };

  const endPod = (podId) => {
    setPods((prevPods) => prevPods.filter((p) => p.id !== podId));
  };

  const addLesson = (podId, topic, summary) => {
    setPods((prevPods) =>
      prevPods.map((p) =>
        p.id === podId
          ? { ...p, lessons: [...p.lessons, { topic, summary }] }
          : p
      )
    );
  };

  return (
    <Router>
      <PageLayout>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home pods={pods} />} />
            <Route path="/create" element={<PodSection onCreate={createPod} />} />
            <Route
              path="/pods/:id"
              element={<PodView pods={pods} onAddLesson={addLesson} onEnd={endPod} />}
            />
            {/* Placeholder routes for the new links */}
            <Route path="/contact" element={<div className="card"><h2>Contact Us</h2><p>This is a placeholder for the Contact Us page.</p></div>} />
            <Route path="/info" element={<div className="card"><h2>Info</h2><p>This is a placeholder for the Info page.</p></div>} />
          </Routes>
        </div>
      </PageLayout>
    </Router>
  );
}

export default App;