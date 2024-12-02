import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReleaseDetails from './components/ReleasesDetails';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/:name/:id" element={<ReleaseDetails />} />
        </Routes>
      </Router>
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();
