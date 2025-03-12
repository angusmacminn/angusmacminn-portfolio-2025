import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import SingleWork from '../components/SingleWork';

function AppRouter() {
    return (
        <BrowserRouter>
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/work/:slug" element={<SingleWork />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}

export default AppRouter;