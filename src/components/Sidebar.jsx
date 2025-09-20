import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(52, 152, 219, 0.2);
  z-index: 1000;
  display: none;
  padding: 2rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);

  @media (min-width: 769px) {
    display: block;
  }

  @media (min-width: 1200px) {
    width: 280px;
    padding: 2.5rem;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(52, 152, 219, 0.2);
  margin-left: -2rem;
  padding-left: 0;

  h2 {
    margin: 0;
    font-family: "Fredoka One", cursive;
    font-size: 1.8rem;
    font-weight: 400;
    background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-left: 3rem;
  }
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SidebarNavBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  color: #6c757d;
  padding: 1rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  text-align: left;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  @media (min-width: 769px) {
    &:hover {
      background: rgba(52, 152, 219, 0.1);
      color: #3498db;
      transform: translateX(5px);
    }
  }

  &.active {
    background: rgba(52, 152, 219, 0.15);
    color: #3498db;
    font-weight: 600;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #3498db;
      border-radius: 0 2px 2px 0;
    }
  }
`;

const SidebarIcon = styled.span`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const SidebarLabel = styled.span`
  flex: 1;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  color: #e74c3c;
  padding: 1rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  text-align: left;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-top: 2rem;
  position: relative;
  overflow: hidden;

  @media (min-width: 769px) {
    &:hover {
      background: rgba(231, 76, 60, 0.1);
      color: #c0392b;
      transform: translateX(5px);
    }
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { isLoggedIn, logout } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/matching";
    }
    return location.pathname.startsWith(path);
  };

  const hasNotification = window.globalHasNewNotification || false;

  const navItems = [
    {
      id: "home",
      label: t("common.home"),
      icon: "🏠",
      path: "/",
    },
    {
      id: "chatting",
      label: t("common.chat"),
      icon: "💬",
      path: "/chatting",
    },
    {
      id: "profile",
      label: t("common.profile"),
      icon: "👤",
      path: "/profile",
    },
    {
      id: "settings",
      label: t("common.settings"),
      icon: "⚙️",
      path: "/settings",
    },
  ];

  return (
    <SidebarContainer>
      <SidebarHeader>
        <h2>UniLingo</h2>
      </SidebarHeader>

      <SidebarNav>
        {isLoggedIn ? (
          <>
            {navItems.map((item) => (
              <SidebarNavBtn
                key={item.id}
                className={isActive(item.path) ? "active" : ""}
                onClick={() => handleNavigation(item.path)}
              >
                <SidebarIcon>
                  {item.icon}
                  {item.id === "chatting" && hasNotification && (
                    <NotificationBadge>!</NotificationBadge>
                  )}
                </SidebarIcon>
                <SidebarLabel>{item.label}</SidebarLabel>
              </SidebarNavBtn>
            ))}
            <LogoutButton onClick={handleLogout}>
              <SidebarIcon>🚪</SidebarIcon>
              <SidebarLabel>{t("auth.logout")}</SidebarLabel>
            </LogoutButton>
          </>
        ) : (
          <>
            <SidebarNavBtn onClick={() => handleNavigation("/login")}>
              <SidebarIcon>🔑</SidebarIcon>
              <SidebarLabel>{t("auth.login")}</SidebarLabel>
            </SidebarNavBtn>
            <SidebarNavBtn onClick={() => handleNavigation("/signup")}>
              <SidebarIcon>📝</SidebarIcon>
              <SidebarLabel>{t("auth.signup")}</SidebarLabel>
            </SidebarNavBtn>
          </>
        )}
      </SidebarNav>
    </SidebarContainer>
  );
};

export default Sidebar;
