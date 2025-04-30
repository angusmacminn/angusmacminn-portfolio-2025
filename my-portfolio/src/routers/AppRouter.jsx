import { BrowserRouter, Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import SingleWork from '../components/SingleWork';
import ExperimentsPage from '../pages/ExperimentsPage';
import ScrollToTop from '../utils/ScrollToTop';

import {AnimatePresence, motion} from 'framer-motion';

// page transition variants
const pageVariants = {
    initial: {
        opacity: 0,
        x: "-100vw" // slide in from left
    },
    in: {
        opacity: 1,
        x: 0 // arrive at center
    },
    out: {
        opacity: 0,
        x: "100vw" // slide out to right
    }
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
};

// wrapper component to apply motion to routes
function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait"> {/* 'wait' ensures exit animation finishes before enter */}
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

                    <Route path="/experiments" element={
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <ExperimentsPage />
                        </motion.div>
                    } />
            </Routes>
        </AnimatePresence>
    )
}



function AppRouter() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <main>
                <AnimatedRoutes />
            </main>
        </BrowserRouter>
    )
}

export default AppRouter;