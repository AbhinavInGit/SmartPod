import React from "react";
import { Link } from "react-router-dom";

function Home({ pods }) {
  return (
    <div className="card">
      <h2>🏠 Home</h2>
      <p>Active Pods: {pods.length}</p>

      <h3>Available Pods</h3>
      {pods.length === 0 && <p>No pods yet</p>}
      {pods.map((pod) => (
        <div key={pod.id}>
          <span>{pod.name}</span>{" "}
          <Link to={`/pods/${pod.id}`}>
            <button>Join</button>
          </Link>
        </div>
      ))}

      <br />
      
      {/* --- Button Container --- */}
      <div className="home-actions-container">
        <Link to="/create">
          <button>Create New Pod</button>
        </Link>
        <Link to="/microlearning">
          <button className="animated-gradient-button">
            Adaptive Microlearning
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;