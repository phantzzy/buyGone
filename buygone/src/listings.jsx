import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles.css';
import './listings.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Listings = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [underlyingSubcategories, setUnderlyingSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedUnderlyingSubcategory, setSelectedUnderlyingSubcategory] = useState('');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    

    useEffect(() => {

        // Fetch categories from the database

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch('http://localhost:5000/listings');
                if (response.ok) {
                    const data = await response.json();
                    setListings(data); // Store all listings
                    setFilteredListings(data); // Initialize filtered listings with all data
                } else {
                    console.error('Failed to fetch listings');
                }
            } catch (err) {
                console.error('Error fetching listings:', err);
            }
        };
    
        fetchListings();
    }, []);
    

    const applyFilters = (category, subcategory, minPrice, maxPrice) => {
        const filtered = listings.filter((listing) => {
            const price = listing.price;
            const min = minPrice ? parseFloat(minPrice) : 0;
            const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    
            const priceMatch = price >= min && price <= max;
            const categoryMatch = category ? listing.category === category : true;
            const subcategoryMatch = subcategory ? listing.subcategory === subcategory : true;
    
            return priceMatch && categoryMatch && subcategoryMatch;
        });
    
        setFilteredListings(filtered);
    };

    const handleCategoryChange = (e) => {
        const category = categories.find(cat => cat.name === e.target.value);
        setSelectedCategory(e.target.value);
        setSubcategories(category?.subcategories || []);
        setSelectedSubcategory('');
        setUnderlyingSubcategories([]);
        setSelectedUnderlyingSubcategory('');
    };
    
    const handleSubcategoryChange = (e) => {
        const subcategory = subcategories.find(sub => sub.name === e.target.value);
        setSelectedSubcategory(e.target.value);
    
        const validUnderlyingSubcategories = subcategory?.subcategories || [];
        setUnderlyingSubcategories(validUnderlyingSubcategories);
        setSelectedUnderlyingSubcategory('');
    };
    

    // Filter listings by price range

    useEffect(() => {
        const filtered = listings.filter((listing) => {
            const price = listing.price;
            const min = minPrice ? parseFloat(minPrice) : 0;
            const max = maxPrice ? parseFloat(maxPrice) : Infinity;
            return price >= min && price <= max;
        });
    
        setFilteredListings(filtered);
    }, [listings, minPrice, maxPrice, selectedCategory, selectedSubcategory]);
    

    return (
        <>
            <Navbar />
            <main className="main-content" style={{ display: 'flex' }}>

                {/* Sidebar Filters */}

                <aside className="sidebar">
                    <h3>Filter By:</h3>

                    {/* Category Dropdown */}

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select value={selectedCategory} onChange={handleCategoryChange}>
                            <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Subcategory Dropdown */}

                    {subcategories.length > 0 && (
                        <div className="form-group">
                            <label htmlFor="subcategory">Subcategory</label>
                            <select value={selectedSubcategory} onChange={handleSubcategoryChange}>
                                <option value="">All Subcategories</option>
                                {subcategories.map((sub) => (
                                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                                ))}
                            </select>

                        </div>
                    )}

                    {/* Underlying Subcategory Dropdown */}

                    {underlyingSubcategories.length > 0 && (
    <div className="form-group">
        <label htmlFor="underlyingSubcategory">Underlying Subcategory</label>
        <select
            id="underlyingSubcategory"
            value={selectedUnderlyingSubcategory}
            onChange={(e) => setSelectedUnderlyingSubcategory(e.target.value)}
        >
            <option value="">Select underlying subcategory</option>
            {underlyingSubcategories.map((underSubcat, index) => (
                <option key={index} value={underSubcat}>{underSubcat}</option>
            ))}
        </select>
    </div>
)}

                    {/* Price Range Filters */}

                    <div className="form-group">
                        <label htmlFor="minPrice">Min Price</label>
                        <input
                            type="number"
                            id="minPrice"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Math.max(0, e.target.value))}
                            placeholder="Min"
                            style={{ appearance: 'textfield' }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="maxPrice">Max Price</label>
                        <input
                            type="number"
                            id="maxPrice"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Math.max(0, e.target.value))}
                            placeholder="Max"
                            style={{ appearance: 'textfield' }}
                        />
                    </div>

                    <button onClick={() => applyFilters(selectedCategory, selectedSubcategory, minPrice, maxPrice)}>
    Apply Filters
</button>

                </aside>

                {/* Listings Section */}

                <section className="listings-section" style={{ flexGrow: 1 }}>
    <h2>All Listings</h2>

    <div className="listings-grid">
    {filteredListings.length > 0 ? (
        filteredListings.map((listing) => (
            <div key={listing._id} className="listing-card">
                <Link to={`/listing/${listing._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>

                    {/* Image */}

                    <div className="listing-image-placeholder">
                        <img
                            src={listing.images[0] || 'default-image.png'} // Use default if image fails
                            alt={listing.title}
                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                        />
                    </div>

                    <h3>{listing.title}</h3>
                    <span className="price">€{listing.price}</span>
                    <span className="seller">{listing.email}</span>
                    {listing.dynamicFields &&
                        listing.dynamicFields.map((field, index) => (
                            <p key={index}>
                                <strong>{field.label}:</strong> {field.value || 'N/A'}
                            </p>
                        ))}
                </Link>
            </div>
        ))
    ) : (
        <p>No listings found.</p>
    )}
</div>


</section>
            </main>
            <Footer />
        </>
    );
};

export default Listings;
