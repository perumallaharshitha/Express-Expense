import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import UserLoginProvider from './files/contexts/UserLoginContext'; // Correct import
import Login from './files/Login/Login.jsx';
import About from './files/About/About.jsx';
import SignUp from './files/SignUp/SignUp.jsx';
import Category from './files/Category/Category.jsx';
import Travel from './files/Categories/Travel/Travel.jsx';
import Food from './files/Categories/Food/Food.jsx';
import Subscription from './files/Categories/Subscription/Subscription.jsx';
import Clothing from './files/Categories/Clothing/Clothing.jsx';
import Jewellery from './files/Categories/Jewellery/Jewellery.jsx';
import Medical from './files/Categories/Medical/Medical.jsx';
import Total from './files/Categories/Total/Total.jsx';
import Report from './files/Report/Report.jsx';
import Graph from './files/Graphs/Graphs.jsx';
import Page from './Page.jsx';
import Home from './files/Home/Home.jsx';
import Profile from './files/Profile/Profile.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

function App() {
  const browserRouter = createBrowserRouter([
    {
      path: '/',
      element: <Page />,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path: 'about',
          element: <About />,
        },
        {
          path: 'category',
          element: (
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          ),
          children: [
            {
              path: 'travel',
              element: (
                <ProtectedRoute>
                  <Travel />
                </ProtectedRoute>
              ),
            },
            {
              path: 'food',
              element: (
                <ProtectedRoute>
                  <Food />
                </ProtectedRoute>
              ),
            },
            {
              path: 'subscription',
              element: (
                <ProtectedRoute>
                  <Subscription />
                </ProtectedRoute>
              ),
            },
            {
              path: 'clothing',
              element: (
                <ProtectedRoute>
                  <Clothing />
                </ProtectedRoute>
              ),
            },
            {
              path: 'jewellery',
              element: (
                <ProtectedRoute>
                  <Jewellery />
                </ProtectedRoute>
              ),
            },
            {
              path: 'medical',
              element: (
                <ProtectedRoute>
                  <Medical />
                </ProtectedRoute>
              ),
            },
            {
              path: 'total',
              element: (
                <ProtectedRoute>
                  <Total />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: 'report',
          element: (
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          ),
          children: [
            {
              path: 'graph',
              element: (
                <ProtectedRoute>
                  <Graph />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'signup',
          element: <SignUp />,
        },
        {
          path: 'profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <UserLoginProvider>  {/* Use the correct context provider */}
      <div className="main">
        <RouterProvider router={browserRouter} />
      </div>
    </UserLoginProvider>
  );
}

export default App;
