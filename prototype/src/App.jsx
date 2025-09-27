import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import PodSection from "./components/PodSection";
import PodView from "./components/PodView";
import Navbar from "./components/Navbar";
import Microlearning from "./components/Microlearning";
import Login from "./components/Login"; // Import the Login component

const PageLayout = ({ children }) => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/'; // Hide Navbar on the login page

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
            <Route path="/" element={<Login />} /> {/* Login page is the default route */}
            <Route path="/home" element={<Home pods={pods} />} /> {/* Home page */}
            <Route path="/create" element={<PodSection onCreate={createPod} />} />
            <Route
              path="/pods/:id"
              element={<PodView pods={pods} onAddLesson={addLesson} onEnd={endPod} />}
            />
            <Route path="/microlearning" element={<Microlearning />} />
            <Route path="/contact" element={<div className="card"><h2>Contact Us</h2><p>This is a placeholder for the Contact Us page.</p></div>} />
            <Route path="/info" element={<div className="card"><h2>Info</h2><p>This is a placeholder for the Info page.</p></div>} />
          </Routes>
        </div>
      </PageLayout>
    </Router>
  );
}

export default App;