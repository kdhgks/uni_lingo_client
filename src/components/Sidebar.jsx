import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useLanguage } from "../contexts/LanguageContext";
import { FiHome, FiMessageCircle, FiUser, FiSettings } from "react-icons/fi";

const SideBarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(52, 152, 219, 0.2);
  z-index: 1000;
  display: none;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    display: flex;
  }

  .dark-mode & {
    background: rgba(30, 30, 30, 0.98);
    border-right: 1px solid rgba(52, 152, 219, 0.4);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  }
`;

const SideBarHeader = styled.div`
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(52, 152, 219, 0.1);
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .dark-mode & {
    border-bottom: 1px solid rgba(52, 152, 219, 0.3);
  }
`;

const Logo = styled.div`
  font-family: "Fredoka One", cursive;
  font-size: 1.8rem;
  font-weight: 400;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
  margin-left: 0.5rem;
`;

const NavList = styled.nav`
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6c757d;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  position: relative;

  &:hover {
    background: rgba(52, 152, 219, 0.1);
    color: #3498db;
  }

  &.active {
    background: linear-gradient(
      90deg,
      rgba(52, 152, 219, 0.15) 0%,
      transparent 100%
    );
    color: #3498db;
    font-weight: 600;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
    }
  }

  .dark-mode & {
    color: #b0b0b0;

    &:hover {
      background: rgba(52, 152, 219, 0.2);
      color: #5dade2;
    }

    &.active {
      background: linear-gradient(
        90deg,
        rgba(52, 152, 219, 0.25) 0%,
        transparent 100%
      );
      color: #5dade2;
    }
  }
`;

const NavIcon = styled.div`
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
`;

const NavLabel = styled.span`
  flex: 1;
`;

const UnreadBadge = styled.span`
  background: linear-gradient(135deg, #e74c3c 0%, #f39c12 100%);
  color: white;
  border-radius: 12px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0 6px;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
`;

const SideBarFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(52, 152, 219, 0.1);

  .dark-mode & {
    border-top: 1px solid rgba(52, 152, 219, 0.3);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(52, 152, 219, 0.05);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(52, 152, 219, 0.1);
  }

  .dark-mode & {
    background: rgba(52, 152, 219, 0.15);
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .dark-mode & {
    color: #ffffff;
  }
`;

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .dark-mode & {
    color: #b0b0b0;
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [user, setUser] = useState(null);

  // 사용자 정보 로드
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        setUser(null);
      }
    }
  }, []);

  // 전역 unread count 변경 감지
  useEffect(() => {
    const updateUnreadCount = () => {
      const newCount = window.globalTotalUnreadCount || 0;
      setTotalUnreadCount((prevCount) => {
        return prevCount !== newCount ? newCount : prevCount;
      });
    };

    updateUnreadCount();
    const interval = setInterval(updateUnreadCount, 2000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    {
      id: "home",
      label: t("common.home"),
      icon: <FiHome />,
      path: "/",
    },
    {
      id: "chatting",
      label: t("common.chat"),
      icon: <FiMessageCircle />,
      path: "/chatting",
    },
    {
      id: "profile",
      label: t("common.profile"),
      icon: <FiUser />,
      path: "/profile",
    },
    {
      id: "settings",
      label: t("common.settings"),
      icon: <FiSettings />,
      path: "/settings",
    },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/matching";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <SideBarContainer>
      <SideBarHeader>
        <Logo>UniLingo</Logo>
      </SideBarHeader>

      <NavList>
        {tabs.map((tab) => (
          <NavItem
            key={tab.id}
            className={isActive(tab.path) ? "active" : ""}
            onClick={() => navigate(tab.path)}
          >
            <NavIcon>{tab.icon}</NavIcon>
            <NavLabel>{tab.label}</NavLabel>
            {tab.id === "chatting" && totalUnreadCount > 0 && (
              <UnreadBadge>{totalUnreadCount}</UnreadBadge>
            )}
          </NavItem>
        ))}
      </NavList>

      <SideBarFooter>
        {user && (
          <UserInfo onClick={() => navigate("/profile")}>
            <UserAvatar>
              {user.profile_image_url ||
              user.profile_image ||
              user.profileImage ? (
                <img
                  src={
                    user.profile_image_url ||
                    user.profile_image ||
                    user.profileImage
                  }
                  alt={user.nickname || user.username}
                />
              ) : (
                "👤"
              )}
            </UserAvatar>
            <UserDetails>
              <UserName>{user.nickname || user.username || "User"}</UserName>
              <UserEmail>{user.school || ""}</UserEmail>
            </UserDetails>
          </UserInfo>
        )}
      </SideBarFooter>
    </SideBarContainer>
  );
};

export default Sidebar;
