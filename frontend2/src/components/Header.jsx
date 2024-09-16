import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Login } from './Login';
import { getMe } from '../services/auth';
import { UserInfo } from './Userinfo';

export const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [updateHeader, setUpdateHeader] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('loginInfo');
    if (token && token !== "undefined") {
      const getUserInfo = async () => {
        const userInfo = await getMe(token);
        setUserInfo(userInfo);
      };
      getUserInfo();
    }
  }, [updateHeader]);

  const handleClickLogin = () => {
    setShowLogin(true);
  };

  const handleClickProfile = () => {
    const token = localStorage.getItem('loginInfo');
    if (token && token !== "undefined") {
      setShowUserProfile(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loginInfo');
    setUserInfo(null);
    setShowUserProfile(false);
  };

  return (
    <header>
      <section className="first-row-wrapper">
        <div className="user-wrapper">
          {!userInfo ? (
            <button onClick={handleClickLogin}><IconLogin/>Go!</button>
          ) : (
            <button onClick={handleClickProfile}>
              <IconUserFilled />
              <div>{userInfo.fname}</div>
            </button>
          )}
        </div>
      </section>
      <Navbar />
      {showLogin && (
        <Login setShowLogin={setShowLogin} setUserInfo={setUserInfo} setUpdateHeader={setUpdateHeader} updateHeader={updateHeader} />
      )}
      {showUserProfile && (
        <UserInfo setShowUserProfile={setShowUserProfile} userInfo={userInfo} setUserInfo={setUserInfo} handleLogout={handleLogout} />
      )}
    </header>
  );
};
