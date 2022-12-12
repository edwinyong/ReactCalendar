import React, { useState, useEffect } from 'react';
import './App.css';
import { useRoutes } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Login from './Login/Login';
export default function App() {
    
    const routes = useRoutes([
        {
          path: "/",
          element: <Dashboard />
        },
        {
          path: "/login",
          element: <Login />
        }
      ]);

    return routes;

}

