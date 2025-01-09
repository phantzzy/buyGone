import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles.css';
import './create_listing.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


const CreateListing = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [underlyingSubcategories, setUnderlyingSubcategories] = useState([]);
    const [selectedUnderlyingSubcategory, setSelectedUnderlyingSubcategory] = useState('');
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionCount, setDescriptionCount] = useState(0);
    const [price, setPrice] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [images, setImages] = useState([]);
    const [dynamicFields, setDynamicFields] = useState([]);
    const [dynamicFieldsState, setDynamicFieldsState] = useState({});
    const [title, setTitle] = useState('');

    // Fetch categories from the API
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('http://localhost:5000/categories');
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();

        const fetchLocations = async () => {
            try {
                const res = await fetch('http://localhost:5000/locations');
                const data = await res.json();
                setLocations(data);
            } catch (err) {
                console.error('Failed to fetch locations:', err);
            }
        };
        fetchLocations();
    }, []);

    // Handle category selection

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
    
        // Find the selected category

        const selectedCat = categories.find((cat) => cat.name === category);
    
        // Reset subcategories and subcategory selection

        setSubcategories(selectedCat?.subcategories || []);
        setSelectedSubcategory(''); // Reset selected subcategory
        setUnderlyingSubcategories([]); // Reset underlying subcategories
        setSelectedUnderlyingSubcategory(''); // Reset selected underlying subcategory
    
        // Reset dynamic fields if needed
        setDynamicFields([]); 
        setDynamicFieldsState({});
    };

    const handleSubcategoryChange = (e) => {
        const subcategory = e.target.value;
        setSelectedSubcategory(subcategory);
    
        // Find the selected subcategory

        const selectedSubcat = subcategories.find((subcat) => subcat.name === subcategory);
    
        // Update underlying subcategories

        setUnderlyingSubcategories(selectedSubcat?.subcategories || []);
        setSelectedUnderlyingSubcategory(""); // Reset underlying subcategory
    
        // Set dynamic fields or default to an empty array

        setDynamicFields(selectedSubcat?.fields || []);
    };
    
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files); // Handle multiple image selection
    
        const previewImages = files.map(file => ({
            url: URL.createObjectURL(file), // Create preview
            file,
        }));
    
        setImages(prevImages => [...prevImages, ...previewImages]);
    };

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };
    
    const handleDescriptionChange = (e) => {
        const input = e.target.value;
        if (input.length <= 2000) { // Hard limit of 2000 characters
            setDescription(input);
            setDescriptionCount(input.length);
        }
    };

    const handlePriceChange = (e) => {
        let input = e.target.value.replace(',', '.'); 
        const regex = /^\d{0,7}(\.\d{0,2})?$/; // Max 7 digits before decimal, 2 after
        if (regex.test(input)) {
            setPrice(input);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Collect dynamic fields data
        const selectedFields = dynamicFields.map((field) => ({
            label: field.label,
            value: dynamicFieldsState[field.label] || "N/A", // Default to "N/A" if not filled
        }));
    
        const listingData = {
            title,
            category: selectedCategory,
            subcategory: selectedSubcategory,
            dynamicFields: selectedFields,
            description,
            price: parseFloat(price),
            email,
            number,
            location: selectedLocation,
            images: images.map((img) => img.url),
        };
    
        try {
            const response = await fetch("http://localhost:5000/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(listingData),
            });
    
            if (response.ok) {
                alert("Listing created successfully!");
                navigate("/");
            } else {
                console.error("Failed to create listing");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };
     

    return (
        <>
            <Navbar />

            <main className="create-listing-main">
                <h1>Listing Information</h1>
                <form className="listing-form" onSubmit={handleSubmit}>

                    {/* Category Dropdown */}

                    <div className="form-group">
                        <label htmlFor="category">Category *</label>
                        <select id="category" value={selectedCategory} onChange={handleCategoryChange} required>
                            <option value="">Select category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category.name}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Subcategory Dropdown */}

                    {subcategories.length > 0 && (
    <div className="form-group">
        <label htmlFor="subcategory">Subcategory *</label>
        <select
            id="subcategory"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            required
        >
            <option value="">Select subcategory</option>
            {subcategories.map((subcat, index) => (
                <option key={index} value={subcat.name}>
                    {subcat.name}
                </option>
            ))}
        </select>
    </div>
)}


{/* Dynamic Fields Rendering */}

{dynamicFields.map((field, index) => (
    <div key={index} className="form-group">
        <label>{field.label}</label>
        {field.type === 'select' ? (
            <select
                value={dynamicFieldsState[field.label] || ''}
                onChange={(e) =>
                    setDynamicFieldsState({
                        ...dynamicFieldsState,
                        [field.label]: e.target.value,
                    })
                }
            >
                <option value="">Select {field.label}</option>
                {field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        ) : (
            <input
                type={field.type}
                value={dynamicFieldsState[field.label] || ''}
                onChange={(e) =>
                    setDynamicFieldsState({
                        ...dynamicFieldsState,
                        [field.label]: e.target.value,
                    })
                }
            />
        )}
    </div>
))}


                    {/* Underlying Subcategory Dropdown */}

                    {underlyingSubcategories.length > 0 && (
                        <div className="form-group">
                            <label htmlFor="underlyingSubcategory">Underlying Subcategory *</label>
                            <select id="underlyingSubcategory" value={selectedUnderlyingSubcategory} onChange={(e) => setSelectedUnderlyingSubcategory(e.target.value)} required>
                                <option value="">Select underlying subcategory</option>
                                {underlyingSubcategories.map((underSubcat, index) => (
                                    <option key={index} value={underSubcat}>{underSubcat}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="title">Listing Title *</label>
                        <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter the title of your listing"
                        required
                    />
                    </div>


                    <div className="form-group">
                        <label htmlFor="images">Images *</label>
                        <p className="image-helper">
                            Increase your chance of sales by uploading images that are not blurry, that clearly show the condition of the listing, and any relevant brand markings.
                            Image format .webp .jpg .jpeg .png and minimum size of 300 x 300px (For optimal image use minimum size of 700 x 700 px)
                        </p>
                        <input
                            type="file"
                            id="images"
                            accept="image/webp, image/jpeg, image/jpg, image/png"
                            multiple
                            onChange={handleImageUpload}
                            required
                        />

                        {/* Image Previews */}
                        
                        <div className="image-preview-container">
                            {images.map((image, index) => (
                                <div key={index} className="image-preview">
                                    <img src={image.url} alt={`Preview ${index}`} />
                                    <button type="button" className="remove-image red-circle" onClick={() => handleRemoveImage(index)}>✖</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Product description *</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Describe your listing: the more details, the better for buyers! Markdown formatting is supported."
                            required
                        ></textarea>
                        <p className="description-counter">{descriptionCount} / 2000 characters</p>
                    </div>

                    {/* Location Dropdown */}

                    <div className="form-group">
                        <label htmlFor="location">Location *</label>
                        <select id="location" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} required>
                            <option value="">Select location</option>
                            {locations.map((location, index) => (
                                <option key={index} value={location.name}>{location.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Input */}

                    <div className="form-group">
                        <label htmlFor="price">Price *</label>
                        <input type="text" id="price" value={price} onChange={handlePriceChange} placeholder="Enter a price for the listing. You can use decimals." required />
                    </div>

                    {/* Email Input */}

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" required />
                    </div>

                    {/* Number Input */}

                    <div className="form-group">
                        <label htmlFor="number">Contact Number *</label>
                        <input type="tel" id="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Enter contact number" required />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="create-listing">Create Listing</button>
                    </div>
                </form>
            </main>

            <Footer />
        </>
    );
};

export default CreateListing;
