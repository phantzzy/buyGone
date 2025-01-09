import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';
import './login.css';
import { BsGoogle } from 'react-icons/bs';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/signup', {
                email,
                password,
            });

            // Store token

            localStorage.setItem('token', res.data.token);
            setMessage('Signup Successful!');

            // Redirect to home page
            
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup Failed!');
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
                <h1 className="login-title">Sign Up</h1>
                <p>Create an account to start using BuyGone.</p>
                <form className="login-form" onSubmit={handleSignup}>
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
                    <button type="submit" className="login-button">Sign Up</button>
                </form>
                <div className="login-or">OR</div>
                <button className="google-login-button">
                    <BsGoogle className="google-icon" /> Sign Up With Google
                </button>
                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}
                <p className="signup-link">Already have an account? <a href="/login">Log In</a></p>
            </div>
        </div>
    );
};

export default SignupPage;
