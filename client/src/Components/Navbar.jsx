import React, { useEffect, useState } from "react";
import user from "../assets/user.png";
import lemon from "../assets/lemon.png";
import { useNavigate, useParams } from "react-router-dom";
import { Button, ConfigProvider, Flex, Popover } from "antd";
import { getUserById, logout } from "../Endpoints/Auth";
import { isStudent, isTokenExpired } from "../Helpers";

import {
  Navbar as AceNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../AceComponents/ui/resizable-navbar";

const text = <span>Profile</span>;

const buttonWidth = 80;

const Navbar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [log, setLog] = useState();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDashboard = () => {
    isStudent()
      ? navigate("/student-dashboard")
      : navigate("/educator-dashboard");
  };

  useEffect(() => {
    setLog(
      !localStorage.getItem("token") ||
        isTokenExpired(localStorage.getItem("token"))
    );
  }, [localStorage.getItem("token")]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    logout()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    getUserById()
      .then((res) => {
        setUserInfo(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleProfile = () => {
    // getUserById()
    //   .then((res) => {
    //     setUserInfo(res?.data);
    //   })
    //   .then((err) => {
    //     console.log(err);
    //   });
  };

  const content = (
    <div>
      <p>{userInfo.name}</p>
      <p>{userInfo.email}</p>
      <p>{userInfo.role}</p>
      {/* <button onClick={handleLogin}>logout</button> */}
    </div>
  );

  const navItems = [
    {
      name: "Dashboard",
      link: "#features",
      click: handleDashboard,
    },
    {
      name: "Home",
      link: "#pricing",
      click: () => navigate("/home"),
    },
    {
      name: log ? "Login" : "Logout",
      link: "#contact",
      click: log ? handleLogin : handleLogout,
    },
    {
      name: "Contact",
      link: "#contact",
      click: () => scrollTo("#contact"),
    },
  ];

  return (
    <div className="fixed w-full z-10 py-3">
      <AceNavbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo onClick={() => {}} />
          <NavItems items={navItems} />
          {window.location.pathname == "/" && (
            <div className="flex items-center gap-4">
              {/* <NavbarButton variant="secondary">Profile</NavbarButton> */}
              <NavbarButton
                onClick={() => {
                  navigate("/home");
                }}
                className="get-started-button"
              >
                Get Started
              </NavbarButton>
            </div>
          )}
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </AceNavbar>

      {/* Navbar */}
    </div>
  );
};

export default Navbar;
