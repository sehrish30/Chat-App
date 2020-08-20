import React, { lazy, Suspense } from 'react';
import { Switch } from 'react-router';
// import logo from './logo.svg';
import 'rsuite/dist/styles/rsuite-default.css';
import './styles/main.scss';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/Home';
// import SignIn from './pages/SignIn';
import { ProfileProvider } from './context/profile.context';
import { ErrorBoundary } from './components/ErrorBoundary';

const SignIn = lazy(() => import('./pages/SignIn'));

function App() {
  return (
    <ErrorBoundary>
      <ProfileProvider>
        <Switch>
          <PublicRoute path="/signin">
            <Suspense fallback={<div>Loading...</div>}>
              <SignIn />
            </Suspense>
          </PublicRoute>
          <PrivateRoute path="/">
            <Home />
          </PrivateRoute>
        </Switch>
      </ProfileProvider>
    </ErrorBoundary>
  );
}

export default App;

// To start also run another cmd with cd functions
// Then npm run serve