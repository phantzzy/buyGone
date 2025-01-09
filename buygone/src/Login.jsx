import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';
import { BsGoogle } from 'react-icons/bs';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/login', {
                email,
                password,
            });

            // Store the token in localStorage

            localStorage.setItem('token', res.data.token);
            setMessage('Login Successful!');

            // Redirect to home page
            
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login Failed!');
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-logo">
                    <img src="../assets/bg_p.png" alt="BuyGone Logo" />
                </div>
                <h1>Welcome to</h1>
                <h2>BuyGone!</h2>
            </div>
            <div className="login-right">
                <h1 className="login-title">Log In</h1>
                <p>Welcome back! Please login to your account.</p>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>E-mail</label>
                        <input
                            type="email"
                            placeholder="username@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-options">
                        <label>
                            <input type="checkbox" /> Remember Me
                        </label>
                        <a href="/forgot-password">Forgot Password?</a>
                    </div>
                    <button type="submit" className="login-button">Log In</button>
                </form>
                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}
                <div className="login-or">OR</div>
                <button className="google-login-button">
                    <BsGoogle className="google-icon" /> Log In With Google
                </button>
                <p className="signup-link">New User? <a href="/signup">Sign Up</a></p>
            </div>
        </div>
    );
};

export default LoginPage;