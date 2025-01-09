import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './Profile.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsPersonCircle } from 'react-icons/bs';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [profileName, setProfileName] = useState('');


    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login'); // Redirect if not logged in
                return;
            }
    
            try {
                const response = await fetch('http://localhost:5000/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token for auth
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }
    
                const data = await response.json();
                setUser(data); // Set user data
                setProfileName(data.name || data.email); // Default to email if name is missing
            } catch (err) {
                console.error('Profile fetch error:', err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
    
        fetchProfile();
    }, [navigate]);
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <Navbar />
            <main className="profile-container">
                <section className="profile-header">
                    <div className="profile-avatar">
                        <BsPersonCircle size={100} />
                    </div>
                    <div className="profile-info">
    <h2 className="profile-username">{profileName}</h2> {/* Display email if no name */}
    <button className="edit-profile-btn">EDIT</button>
</div>

                </section>

                <nav className="profile-nav">
                    <ul>
                        <li className="active">LISTINGS</li>
                        <li>REVIEWS</li>
                        <li>HISTORY</li>
                        <li>ABOUT</li>
                    </ul>
                </nav>

                <section className="profile-listings">
                    {user.listings && user.listings.length > 0 ? (
                        user.listings.map((listing) => (
                            <div key={listing._id} className="listing-card">
                                <div className="listing-thumbnail">
                                    <img src={listing.images[0] || 'default-listing.png'} alt="Listing" />
                                </div>
                                <div className="listing-details">
                                    <p className="listing-title">{listing.title}</p>
                                    <p className="listing-price">€{listing.price}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No listings found.</p>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
};

export default ProfilePage;
