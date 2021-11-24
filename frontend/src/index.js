import React from 'react';
import ReactDOM from 'react-dom';
import { 
  BrowserRouter as Router, 
} from 'react-router-dom';

import { AuthProvider } from './contexts/auth_context';
import App from "./components/app";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);