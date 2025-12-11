import React from "react";
import {
  VStack,
  Text,
  useColorModeValue,
  Heading,
  Icon,
  Flex,
  Divider,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaSlidersH,
  FaCodeBranch,
  FaChartLine,
  FaChevronLeft,
  FaChevronRight,
  FaUserCog,
  FaFile, // Add this import for User Management logo
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card"; // ✅ Using same Card wrapper for consistency

const Sidebar = ({
  collapsed,
  setCollapsed,
  activeIndex,
  onTabClick,
  isMobile,
  isOpen,
  onClose,
}) => {
  // Theme colors (matching EditDevice)
  const sideBarBg = useColorModeValue("white", "navy.700");
  const activeTabBg = useColorModeValue("navy.50", "navy.600");
  const activeTabColor = useColorModeValue("gray.700", "white");
  const iconBg = useColorModeValue("gray.50", "navy.900");

  const sidebarExpandedWidth = "240px";
  const sidebarCollapsedWidth = "70px";
  const sidebarWidth = collapsed ? sidebarCollapsedWidth : sidebarExpandedWidth;
  const topOffset = "70px";

  // Sidebar items
  const tabItems = [
    { label: "Groups", icon: FaUsers, color: "green.400" },
    { label: "Devices", icon: FaSlidersH, color: "orange.400" },
    // { label: "Interface Configs", icon: FaFile, color: "orange.400" },
    { label: "ModbusConfigs", icon: FaCodeBranch, color: "purple.400" },
    { label: "Patches", icon: FaChartLine, color: "blue.400" },
    { label: "User Management", icon: FaUserCog, color: "blue.400" },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  // Map tab index to route
  const tabRoutes = [
    "/groups",
    "/devices",

    "/configs",
    "/patches",
    "/user-management",
  ];

  const getActiveIndex = () => {
    if (activeIndex !== undefined && activeIndex !== null) return activeIndex;
    if (location.pathname.startsWith("/groups")) return 0;
    if (location.pathname.startsWith("/devices")) return 1;
    // if (location.pathname.startsWith("/interface-config")) return 2;

    if (location.pathname.startsWith("/configs")) return 2;
    if (location.pathname.startsWith("/patches")) return 3;
    if (location.pathname.startsWith("/user-management")) return 4;

    return 0;
  };

  // Sidebar content as a function for reuse
  const SidebarContent = () => (
    <Card
      position={isMobile ? "relative" : "fixed"}
      top={isMobile ? undefined : topOffset}
      padding={collapsed ? 1 : 3}
      left={0}
      width={sidebarWidth}
      height={isMobile ? "100vh" : `calc(100vh - ${topOffset})`}
      borderRadius="none"
      zIndex={10}
      bg={sideBarBg}
      transition="width 0.3s ease"
      mt={2}
    >
      {/* Header with collapse toggle */}
      <Flex align="center" justify="space-between" mb={4} px={4} pt={2}>
        {!collapsed && <Heading size="md">Factory Tool</Heading>}

        {!isMobile && (
          <Icon
            mt={collapsed ? 3 : 0}
            mx={collapsed ? 2 : 0}
            as={collapsed ? FaChevronRight : FaChevronLeft}
            onClick={() => setCollapsed(!collapsed)}
            cursor="pointer"
            boxSize={4}
          />
        )}
      </Flex>

      <Divider mb={4} />

      {/* Sidebar Tabs */}
      <VStack spacing={2} align="stretch" px={collapsed ? 1 : 2}>
        {tabItems.map((tab, i) => (
          <Flex
            key={i}
            align="center"
            gap={collapsed ? 0 : 3}
            py={3}
            px={2}
            bg={getActiveIndex() === i ? activeTabBg : collapsed ? iconBg : ""}
            borderRadius="md"
            fontWeight="medium"
            fontSize={"md"}
            cursor="pointer"
            _hover={{ bg: activeTabBg }}
            justifyContent={collapsed ? "center" : "flex-start"}
            onClick={() => {
              if (onTabClick) onTabClick(i);
              navigate(tabRoutes[i]);
              if (isMobile && onClose) onClose();
            }}
            transition="background 0.2s"
          >
            <Icon as={tab.icon} boxSize={5} color={tab.color} padding={0.2} />
            {!collapsed && (
              <Text
                fontSize="md"
                color={getActiveIndex() === i ? activeTabColor : undefined}
                textAlign="left"
              >
                {tab.label}
              </Text>
            )}
          </Flex>
        ))}
      </VStack>
    </Card>
  );

  // Responsive rendering
  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg={sideBarBg}>
          <DrawerCloseButton />
          <DrawerBody p={0}>{SidebarContent()}</DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }
  return SidebarContent();
};

export default Sidebar;
