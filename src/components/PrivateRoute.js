import React from 'react';
import { Redirect, Route } from 'react-router';
import { Loader, Container } from 'rsuite';
import { useProfile } from '../context/profile.context';

const PrivateRoute = ({ children, ...routeProps }) => {
  const { profile, isLoading } = useProfile();
  if (isLoading && !profile) {
    return (
      <Container>
        <Loader
          center
          vetrical
          size="md"
          content="Loading..."
          speed="slow"
          style={{ height: 200 }}
        />
      </Container>
    );
  }
  if (!profile && !isLoading) {
    return <Redirect to="/signin" />;
  }
  return <Route {...routeProps}>{children}</Route>;
};

export default PrivateRoute;
