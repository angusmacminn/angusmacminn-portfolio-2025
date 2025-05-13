import './normalize-fwd.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './routers/AppRouter.jsx'

import { gsap } from 'gsap';
// Assuming SplitText is loaded globally from CDN,
// we can register it here once.
// We add a check to ensure SplitText is actually available globally.
if (window.SplitText) {
  gsap.registerPlugin(window.SplitText);
} else {
  console.error("SplitText plugin not found. Please check CDN script in index.html.");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)
