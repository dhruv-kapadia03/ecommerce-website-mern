import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {BrowserRouter} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Toaster
      position="top-center"
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: '',
        duration: 3000,
        removeDelay: 1000,
        success: {
          duration: 3000,
          style: {
            border: '1px solid #1fc600',
            color: '#1fc600'
          },
          iconTheme: {
            primary: '#1fc600',
          },
        },
        error: {
          duration: 3000,
          style: {
            border: '1px solid #dc0005',
            color: '#dc0005'
          },
          iconTheme: {
            primary: '#dc0005',
          },
        },
      }}
    />
    <App />
  </BrowserRouter>
)
