import React from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import AppRoutes from "./routes";
import Layout from "./pages/layout/layout";
import { useLocation } from "react-router-dom";
import "./App.css";
import ToastProvider from "./components/toastProvider/ToastProvider";

function App() {
  const bg = useColorModeValue("white", "navy.700");
  const color = useColorModeValue("gray.800", "white");
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {isLoginPage ? (
        <Box color={color} bg={bg}>
          <AppRoutes />
        </Box>
      ) : (
        <Layout>
          <Box color={color}>
            <AppRoutes />
          </Box>
        </Layout>
      )}

      <ToastProvider />
    </>
  );
}

export default App;
