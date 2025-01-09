import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Separate Home component
import Categories from './Categories';
import ProfilePage from './Profile';
import LoginPage from './login';
import SignUpPage from './signup';
import CreateListing from './create_listing';
import Listings from './listings';
import ListingDetails from './ListingDetails';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/create_listing" element={<CreateListing />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/listing/:id" element={<ListingDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
