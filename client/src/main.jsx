import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './features/store.js';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from './components/ErrorBoundary';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
    <ToastContainer />
  </StrictMode>,
)
