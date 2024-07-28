import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { GoogleOAuthProvider } from '@react-oauth/google';


const store = configureStore({
  reducer: rootReducer,
});

const clientId = "YOUR_CLIENT_ID_HERE";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
