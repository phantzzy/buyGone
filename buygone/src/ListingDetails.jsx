import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles.css';
import './ListingDetails.css';

const ListingDetails = () => {
    const { id } = useParams(); // Get listing ID from URL
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await fetch(`http://localhost:5000/listings/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setListing(data);
                } else {
                    setError('Failed to load listing details');
                }
            } catch (err) {
                console.error('Error fetching listing details:', err);
                setError('Error fetching listing details');
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <Navbar />
            <main className="listing-details">
                <div className="image-carousel">
                    <img
                        src={listing.images[0] || 'default-image.png'}
                        alt={listing.title}
                        className="main-image"
                    />
                    <div className="thumbnail-container">
                        {listing.images.map((img, index) => (
                            <img key={index} src={img} alt={listing.title} className="thumbnail" />
                        ))}
                    </div>
                </div>

                <section className="details-section">
                    <h1>{listing.title}</h1>
                    <p className="price">Price: €{listing.price}</p>
                    <p className="location">Location: {listing.location}</p>
                    <p className="email">Email: {listing.email}</p>
                    <button className="purchase-btn">Purchase</button>
                </section>

                <section className="description-section">
                    <h3>Description:</h3>
                    <p className="description">{listing.description}</p>
                </section>

                <section className="additional-info-section">
                    <h3>Additional Information:</h3>
                    <div className="info-grid">
                        {listing.dynamicFields && listing.dynamicFields.map((field, index) => (
                            <p key={index}><strong>{field.label}:</strong> {field.value || 'N/A'}</p>
                        ))}
                    </div>
                </section>

                
            </main>
            <Footer />
        </>
    );
};

export default ListingDetails;
