import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Process from './pages/Process';
import Projects from './pages/Projects';
import Reports from './pages/Reports';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminHome from './pages/admin/pages/AdminHome';
import AdminDashboard from './pages/admin/pages/AdminDashboard';
import AdminAbout from './pages/admin/pages/AdminAbout';
import AdminServices from './pages/admin/pages/AdminServices';
import AdminProcess from './pages/admin/pages/AdminProcess';
import SeedProcessData from './pages/admin/pages/SeedProcessData';
import SeedReportsData from './pages/admin/pages/SeedReportsData';
import AdminProjects from './pages/admin/pages/AdminProjects';
import AdminReports from './pages/admin/pages/AdminReports';
import AdminFAQ from './pages/admin/pages/AdminFAQ';
import AdminContact from './pages/admin/pages/AdminContact';
import AdminSettings from './pages/admin/pages/AdminSettings';
import AdminMessages from './pages/admin/pages/AdminMessages';

function App() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <div className="App">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/*" element={
                        <>
                            <Header />
                            <main>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/services" element={<Services />} />
                                    <Route path="/process" element={<Process />} />
                                    <Route path="/projects" element={<Projects />} />
                                    <Route path="/reports" element={<Reports />} />
                                    <Route path="/faq" element={<FAQ />} />
                                    <Route path="/contact" element={<Contact />} />
                                </Routes>
                            </main>
                            <Footer />
                        </>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/home" element={<AdminHome />} />
                    <Route path="/admin/about" element={<AdminAbout />} />
                    <Route path="/admin/services" element={<AdminServices />} />
                    <Route path="/admin/process" element={<AdminProcess />} />
                    <Route path="/admin/seed-process-data" element={<SeedProcessData />} />
                    <Route path="/admin/seed-reports-data" element={<SeedReportsData />} />
                    <Route path="/admin/projects" element={<AdminProjects />} />
                    <Route path="/admin/reports" element={<AdminReports />} />
                    <Route path="/admin/faq" element={<AdminFAQ />} />
                    <Route path="/admin/contact" element={<AdminContact />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                    <Route path="/admin/messages" element={<AdminMessages />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;


