import {
  Box,
  Flex,
  Card,
  VStack,
  HStack,
  Text,
  useColorMode,
  Button,
  useColorModeValue,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import React, { useState } from "react";
import Sidebar from "./sidebar";
import authLogo from "../../assets/png/auth-logo.png";
import lighLogo from "../../assets/png/logo-min.jpeg";
import { useNavigate } from "react-router-dom";
import { useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { nav } from "framer-motion/client";
import axiosInstance from "../../api/axiosInstance";
// import { logout as logoutUrl } from "../../api/apiUrls";

const Navbar = ({ onOpenMobileSidebar, showMobileMenu }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navbarBg = useColorModeValue("white", "navy.700");
  const navbarText = useColorModeValue("navy.700", "white");
  const iconColor = useColorModeValue("secondarygray.900", "yellow");
  const logoSrc = colorMode === "light" ? lighLogo : authLogo;

  // Add menu color variables
  const menuBg = useColorModeValue("white", "navy.700");
  const textColor = useColorModeValue("navy.700", "white");
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const navigate = useNavigate();

  // Updated logout handler
  const handleLogout = async () => {
    try {
      // await axiosInstance.post(logoutUrl);

      // Clear tokens from localStorage
      localStorage.removeItem("UGXAuthorization");

      navigate("/login");
    } catch (error) {
      // Even if API call fails, clear tokens and redirect
      localStorage.removeItem("UGXAuthorization");
      navigate("/login");
    }
  };

  return (
    <HStack
      as="header"
      bg={navbarBg}
      h="80px"
      px={6}
      py={4}
      // borderBottom="1px solid #e2e8f0"
      position="fixed"
      left={0}
      right={0}
      top={0}
      zIndex={2}
      justify="space-between"
    >
      <HStack spacing={3}>
        {showMobileMenu && (
          <IconButton
            icon={<FaBars />}
            aria-label="Open sidebar"
            variant="ghost"
            onClick={onOpenMobileSidebar}
            display={{ base: "flex", md: "none" }}
            mr={2}
          />
        )}
        <img
          src={logoSrc}
          alt="Logo"
          style={{
            height:
              colorMode === "light"
                ? "38px" // Increased size for lighLogo
                : "44px",
          }}
        />
      </HStack>
      <HStack spacing={4}>
        <IconButton
          size="sm"
          aria-label="Toggle color mode"
          onClick={toggleColorMode}
          icon={
            colorMode === "light" ? (
              <IoMdMoon color={iconColor} />
            ) : (
              <IoMdSunny color={iconColor} />
            )
          }
          _hover={{ bg: "transparent" }}
          bg="transparent"
        />
        {/* Avatar with Menu */}
        <Menu>
          <MenuButton p="0px">
            <Avatar
              _hover={{ cursor: "pointer" }}
              name="Configurator"
              bg="#434346ff"
              size="sm"
              w="40px"
              h="40px"
            />
          </MenuButton>
          <MenuList
            boxShadow={shadow}
            p="0px"
            mt="10px"
            borderRadius="20px"
            bg={menuBg}
            border="none"
          >
            <Flex w="100%" mb="0px">
              <Text
                ps="20px"
                pt="16px"
                pb="10px"
                w="100%"
                borderBottom="1px solid"
                borderColor={borderColor}
                fontSize="sm"
                fontWeight="700"
                color={textColor}
              >
                Configurator
              </Text>
            </Flex>
            <Flex flexDirection="column" p="10px">
              <MenuItem
                onClick={handleLogout}
                bg="none"
                _hover={{ cursor: "pointer" }}
                color={textColor}
                borderRadius="8px"
                px="14px"
              >
                <Text fontSize="sm" onClick={handleLogout}>
                  Log out
                </Text>
              </MenuItem>
            </Flex>
          </MenuList>
        </Menu>
      </HStack>
      {/* ...add navbar content here... */}
    </HStack>
  );
};

const Footer = () => {
  const footerBg = useColorModeValue("white", "navy.700");
  const footerText = useColorModeValue("navy.700", "white");
  const { colorMode } = useColorMode();
  const logoSrc = colorMode === "light" ? lighLogo : authLogo;
  // Set logo background only for light mode
  const logoBg = colorMode === "light" ? "#fff" : "transparent";
  return (
    <Box
      as="footer"
      bg={footerBg}
      h="50px"
      px={6}
      py={3}
      position="fixed"
      left="0"
      right={0}
      bottom={0}
      zIndex={2}
    >
      <Flex align="center" justify="center" h="100%" ml={20} gap={2}>
        {/* Show only one logo based on color mode */}
        <Text fontSize="sm">Powered by</Text>
        <img
          src={logoSrc}
          alt="Logo"
          style={{
            height:
              colorMode === "light"
                ? "20px" // Increased size for lighLogo in footer
                : "24px",
            marginRight: "8px",
            borderRadius: "4px",
            background: logoBg,
          }}
        />
      </Flex>
    </Box>
  );
};

const Layout = ({ children }) => {
  const { colorMode } = useColorMode();
  // Set mainBg to blue.50 for both light and dark mode
  const mainBg = useColorModeValue("blue.50", "navy.900");

  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Sidebar width values
  const sidebarWidth = collapsed ? "56px" : "250px";

  return (
    <Box minH="100vh">
      <Sidebar
        borderColor={borderColor}
        shadow={shadow}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Navbar onOpenMobileSidebar={onOpen} showMobileMenu={isMobile} />

      <Box
        bg="transparent"
        p={collapsed ? undefined : 2}
        padding={collapsed ? "26px" : undefined}
        m={0}
        h="100%"
        mt={5}
        ml={isMobile ? 0 : sidebarWidth}
        pt="80px"
        borderRadius="0px"
      >
        {children}
      </Box>

      <Footer />
    </Box>
  );
};

export default Layout;
