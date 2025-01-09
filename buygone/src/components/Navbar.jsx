import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/bg_p.png';
import ukFlag from '../assets/uk-flag-round-circle-icon.png';
import { BsSearch, BsHeartFill, BsBriefcaseFill, BsChatDotsFill, BsPersonFill } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Navbar = ({ 
    listings = [], 
    users = [], 
    categories = [], 
    onSearch = () => {} 
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    // Check login status when component mounts
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                const isExpired = decoded.exp * 1000 < Date.now();
                if (isExpired) {
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                } else {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token');
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
        window.location.reload();
    };

    const handleInputChange = (e) => {
        const value = e.target.value.toLowerCase();
        setQuery(value);

        const filteredListings = (listings || []).filter((listing) =>
            listing.title.toLowerCase().includes(value)
        );
        const filteredUsers = (users || []).filter((user) =>
            user.name.toLowerCase().includes(value)
        );
        const filteredCategories = (categories || []).filter((category) =>
            category.name.toLowerCase().includes(value)
        );

        const combinedResults = [
            ...filteredListings,
            ...filteredUsers,
            ...filteredCategories,
        ];

        onSearch(combinedResults);
    };

    return (
        <>
            <nav className="top-navbar">
                <div className="navbar-container">
                    <div className="logo">
                        <img src={logo} className="logo-image" alt="BuyGone Logo" />
                        <span className="logo-text">BuyGone</span>
                    </div>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search listings, users and categories"
                            className="search-input"
                            value={query}
                            onChange={handleInputChange}
                        />
                        <button className="search-button">
                            <BsSearch />
                        </button>
                    </div>
                    <div className="create-container">
                        <button className="create-listing" onClick={() => navigate('/create_listing')}>CREATE LISTING</button>
                    </div>
                    <div className="icon-group">
                        <BsHeartFill />
                        <BsBriefcaseFill onClick={() => navigate('/popular-listings')} />
                        <BsChatDotsFill />
                        <div className="profile-dropdown">
                            <BsPersonFill onClick={toggleDropdown} />
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/profile">Account</Link>
                                    {isLoggedIn ? (
                                        <button onClick={handleLogout} className="dropdown-button">Logout</button>
                                    ) : (
                                        <Link to="/login">Log-In</Link>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="language-switcher">
                            <img src={ukFlag} alt="English Flag" />
                            ENG
                        </div>
                    </div>
                </div>
            </nav>

            <nav className="bottom-navbar">
                <Link to="/">HOME</Link>
                <Link to="/categories">CATEGORIES</Link>
                <Link to="/listings">LISTINGS</Link>
                <Link to="/popular-users">POPULAR USERS</Link>
                <Link to="/help">HELP</Link>
                <Link to="/about">ABOUT</Link>
                <Link to="/discord">DISCORD</Link>
            </nav>
        </>
    );
};

Navbar.propTypes = {
    listings: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    onSearch: PropTypes.func.isRequired,
};

export default Navbar;
