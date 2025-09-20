import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 localStorage에서 인증 정보 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedIsLoggedIn === "true" && storedUser && storedToken) {
          setIsLoggedIn(true);
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } else {
          // 유효하지 않은 데이터 정리
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        // 에러 발생 시 모든 인증 정보 초기화
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData, authToken) => {
    try {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", authToken);

      setIsLoggedIn(true);
      setUser(userData);
      setToken(authToken);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    try {
      // 매칭 관련 이전 데이터 정리
      localStorage.removeItem("matchingStatus");
      localStorage.removeItem("selectedGender");
      localStorage.removeItem("selectedUniversity");
      localStorage.removeItem("selectedLearningLanguageName");

      // 인증 관련 데이터 정리
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      setIsLoggedIn(false);
      setUser(null);
      setToken(null);
    } catch (error) {}
  };

  const updateUser = (updatedUserData) => {
    try {
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      setUser(updatedUserData);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    isLoggedIn,
    user,
    token,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
