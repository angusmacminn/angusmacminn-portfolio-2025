import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import SingleWork from '../components/SingleWork';
import ExperimentsPage from '../pages/ExperimentsPage';

function AppRouter() {
    return (
        <BrowserRouter>
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/work/:slug" element={<SingleWork />} />
                    <Route path="/experiments" element={<ExperimentsPage />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}

export default AppRouter;