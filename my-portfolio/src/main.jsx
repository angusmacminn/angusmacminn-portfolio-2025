import './normalize-fwd.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './routers/AppRouter.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)
