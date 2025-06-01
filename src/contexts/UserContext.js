import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // 서버 재시작 시 로그인 상태 초기화
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/check-server');
        if (!response.ok) {
          // 서버가 재시작된 경우 로그인 상태 초기화
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        // 서버 연결 실패 시 로그인 상태 초기화
        setUser(null);
        localStorage.removeItem('user');
      }
    };

    checkServerStatus();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export { UserContext }; 