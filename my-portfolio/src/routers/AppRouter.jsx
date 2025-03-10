import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';

function AppRouter() {
    return (
        <BrowserRouter>
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}

export default AppRouter;