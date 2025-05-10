// components/PrivateRoute.js
import React from "react";
import { Route, Redirect } from "react-router-dom";
import NotFoundPage from "../NotFound/NotFound";

const PrivateRoutes = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem("accessToken");

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <NotFoundPage/>
        )
      }
    />
  );
};

export default PrivateRoutes;
