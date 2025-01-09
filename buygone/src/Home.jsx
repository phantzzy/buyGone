import Navbar from './components/Navbar';
import Footer from './components/Footer';
import "./Home.css";
import "./styles.css"

function Home() {
    return (
        <>
            <Navbar />

            {/* Main Content */}
            
            <main className="main-content">
                <section className="section">
                    <h2>ADVERTISED LISTINGS</h2>
                    <a href="#see-all" className="see-all">SEE ALL →</a>
                    <div className="listing-container" style={{ overflowX: 'hidden' }}>
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="listing-card">
                                <div className="listing-image-placeholder"></div>
                                <p>Lorem ipsum dolor sit amet con...</p>
                                <span className="price">€1234.00</span>
                                <span className="seller">John Doe</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="section">
                    <h2>POPULAR LISTINGS</h2>
                    <a href="#see-all" className="see-all">SEE ALL →</a>
                    <div className="listing-container" style={{ overflowX: 'hidden' }}>
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="listing-card">
                                <div className="listing-image-placeholder"></div>
                                <p>Lorem ipsum dolor sit amet con...</p>
                                <span className="price">€1234.00</span>
                                <span className="seller">John Doe</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Home;
