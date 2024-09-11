import React from 'react';
import "./index.css";
import LoginRegister from './pages/Login/LoginRegisterPage';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/Main/UserPage/MainPage';
import PrivacyPolicy from './pages/TermPolicy/PrivacyPolicy';
import TermsAndConditions from './pages/TermPolicy/TermsAndConditions';
import Activity from './pages/Main/UserPage/Activity';
import Address from './pages/Main/UserPage/Address';
import Education from './pages/Main/UserPage/Education';
import Family from './pages/Main/UserPage/Family';
import Language from './pages/Main/UserPage/Language';
import Profile from './pages/Main/UserPage/Profile';
import Scholarship from './pages/Main/UserPage/Scholarship';
import Training from './pages/Main/UserPage/Training';
import Work from './pages/Main/UserPage/Work';
import Reward from './pages/Main/UserPage/Reward';
import ManageStuPage from './pages/Main/StaffPage/ManageStuPage';
import Graph from './pages/Main/StaffPage/Graph';
import ResetPasswordPage from './pages/Main/StaffPage/ResetPasswordPage';
import RoleSelectPage from './pages/Main/StaffPage/RoleSelectPage';

import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import NotFoundPage from './pages/HandlePage/NotFoundPage';

function App() {
  const [cookies] = useCookies(['token']);
  let role = '';
  if (cookies.token) {
    const decodedToken = jwtDecode(cookies.token);
    role = decodedToken.role;
  }

  return (
    <Router>
      <div>
        <section>
          <Routes>
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/term-and-conditions' element={<TermsAndConditions />} />
            <Route
              path="/"
              element={
                cookies.token
                  ? role === "admin" || role === "teacher"
                    ? <ManageStuPage />
                    : <MainPage />
                  : <LoginRegister />
              }
            />
            <Route
              path="/index"
              element={
                cookies.token && (role === "admin" || role === "teacher")
                  ? <NotFoundPage />
                  : <MainPage />
              }
            />

            <Route path='/profile' element={<Profile />} />
            <Route path='/address' element={<Address />} />
            <Route path='/education' element={<Education />} />
            <Route path='/rewards' element={<Reward />} />
            <Route path='/language-talent' element={<Language />} />
            <Route path='/scholarship' element={<Scholarship />} />
            <Route path='/work-detail' element={<Work />} />
            <Route path='/family-detail' element={<Family />} />
            <Route path='/training-detail' element={<Training />} />
            <Route path='/activity-detail' element={<Activity />} />

            <Route path='/:id/index' element={<MainPage />} />
            <Route path='/:id/profile' element={<Profile />} />
            <Route path='/:id/address' element={<Address />} />
            <Route path='/:id/education' element={<Education />} />
            <Route path='/:id/rewards' element={<Reward />} />
            <Route path='/:id/language-talent' element={<Language />} />
            <Route path='/:id/scholarship' element={<Scholarship />} />
            <Route path='/:id/work-detail' element={<Work />} />
            <Route path='/:id/family-detail' element={<Family />} />
            <Route path='/:id/training-detail' element={<Training />} />
            <Route path='/:id/activity-detail' element={<Activity />} />
            
            {/* admin teacher */}
            <Route
              path="/management"
              element={
                cookies.token && (role === "admin" || role === "teacher")
                  ? <ManageStuPage />
                  : <NotFoundPage />
              }
            />
            <Route path='/statistic' element={<Graph />} />
            <Route path='/reset-password' element={<ResetPasswordPage />} />
            <Route path='/role-manage' element={<RoleSelectPage />} />

            <Route path='*' element={<NotFoundPage />} />


          </Routes>
        </section>
      </div>
    </Router >
  )
}

export default App