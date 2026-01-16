import { BrowserRouter, Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import SingleWork from '../components/SingleWork';
import ArchivePage from '../pages/ArchivePage'; // Renamed from ExperimentsPage
import PlaygroundPage from '../pages/PlaygroundPage'; // New page
import Services from '../pages/Services'; // Services page
import ScrollToTop from '../utils/ScrollToTop';
import { useEffect } from 'react';

import {AnimatePresence, motion} from 'framer-motion';

// page transition variants
const pageVariants = {
    initial: {
        opacity: 0,
        // x: "-100vw" // slide in from left
    },
    in: {
        opacity: 1,
        // x: 0 // arrive at center
    },
    out: {
        opacity: 0,
        // x: "100vw" // slide out to right
    }
};

const pageTransition = {
    type: "spring",
    ease: "anticipate",
    duration: 0.5
};

// wrapper component to apply motion to routes
function AnimatedRoutes() {
    const location = useLocation();

    // Track page views on route change
    useEffect(() => {
        if (window.gtag) {
            window.gtag('config', 'G-5GXJNMK19X', {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);

    const handleScrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <AnimatePresence mode="wait"
            onExitComplete={handleScrollToTop}
        > {/* 'wait' ensures exit animation finishes before enter */}
            <Routes location={location} key={location.pathname}> {/* Pass location and key */}
                    <Route path="/" element={
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <HomePage />
                        </motion.div>
                        } />

                    <Route path="/about" element={
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <AboutPage />
                        </motion.div>
                    } />

                    <Route path="/work/:slug" element={
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <SingleWork />
                        </motion.div>
                    } />

                

                    <Route path="/archive" element={
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <ArchivePage />
                        </motion.div>
                    } />

                    <Route path="/playground" element={
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <PlaygroundPage />
                        </motion.div>
                    } />

                    <Route path="/services" element={
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <Services />
                        </motion.div>
                    } />
            </Routes>
        </AnimatePresence>
    )
}



function AppRouter() {
    return (
        <BrowserRouter>
            
            <main>
                <AnimatedRoutes />
            </main>
        </BrowserRouter>
    )
}

export default AppRouter;