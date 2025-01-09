import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    dynamicFields: { type: Object, required: false }, // Store dynamic fields
    description: { type: String, required: true },
    price: { type: Number, required: true },
    email: { type: String, required: true },
    number: { type: String, required: false },
    location: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    createdAt: { type: Date, default: Date.now }
});

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
