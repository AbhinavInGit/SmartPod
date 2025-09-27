import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/login.css';

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="wrapper">
      <div className="login_box">
        <div className="login-header">
          <span>Login</span>
        </div>

        {/* Updated Input Boxes with Placeholders */}
        <div className="input_box">
          <input type="text" id="user" className="input-field" placeholder="Username" required />
          <i className="bx bx-user icon"></i>
        </div>

        <div className="input_box">
          <input type="password" id="pass" className="input-field" placeholder="Password" required />
          <i className="bx bx-lock-alt icon"></i>
        </div>

        <div className="remember-forgot">
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <div className="forgot">
            <a href="#">Forgot password?</a>
          </div>
        </div>

        <div className="input_box">
          <button type="submit" className="input-submit" onClick={handleLogin}>
            Login
          </button>
        </div>

        <div className="register">
          <span>Don't have an account? <a href="#">Register</a></span>
        </div>
      </div>
    </div>
  );
}

export default Login;