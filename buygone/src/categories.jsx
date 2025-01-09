import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { FaBriefcase, FaCar, FaHome, FaTools, FaDesktop, FaTshirt, FaCouch, FaIndustry, FaChild, FaPaw, FaTractor, FaFutbol } from 'react-icons/fa';
import "./Categories.css";
import "./styles.css";

const Categories = () => {
    const categories = [
        { name: 'Work and Business', icon: <FaBriefcase /> },
        { name: 'Transport', icon: <FaCar /> },
        { name: 'Housing', icon: <FaHome /> },
        { name: 'Construction', icon: <FaTools /> },
        { name: 'Electronics', icon: <FaDesktop /> },
        { name: 'Clothing', icon: <FaTshirt /> },
        { name: 'Home and Lifestyle', icon: <FaCouch /> },
        { name: 'Industry and Trade', icon: <FaIndustry /> },
        { name: 'For Kids', icon: <FaChild /> },
        { name: 'Animals', icon: <FaPaw /> },
        { name: 'Farming', icon: <FaTractor /> },
        { name: 'Leisure and Hobbies', icon: <FaFutbol /> },
    ];

    return (
        <>
            <Navbar />

            {/* Categories Content */}
            
            <main className="main-content">
                <section className="categories-section">
                    <div className="categories-grid">
                        {categories.map((category, index) => (
                            <div key={index} className="category-card">
                                <div className="category-icon">{category.icon}</div>
                                <h3>{category.name}</h3>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default Categories;
