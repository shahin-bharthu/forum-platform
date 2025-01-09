import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { persistor, store } from "./store/index.js";
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import App from './App.jsx'
import './index.css'


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  // </StrictMode>
)
