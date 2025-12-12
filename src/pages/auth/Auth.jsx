import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useColorModeValue,
  Button,
  Text,
  InputGroup,
  InputRightElement,
  Flex,
  Link,
  Icon,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card";
import { toast } from "react-toastify";
import { login, getAccessToken } from "../../api/apiUrls";
import axiosInstance from "../../api/axiosInstance";

const Auth = () => {
  const textColor = useColorModeValue("navy.800", "white");
  const textColorSecondary = useColorModeValue("gray.500", "navy.400");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const inputFocusBorder = useColorModeValue("brand.500", "brand.300");
  const cardBg = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0 12px 32px rgba(0, 0, 0, 0.12)",
    "0 12px 32px rgba(0, 0, 0, 0.6)"
  );
  const buttonHoverBg = useColorModeValue("brand.600", "brand.300");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => setShowPassword(!showPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(login, formData);

      if (response.status === 200) {
        const data = response.data;

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Send platform_url instead of token
        // const resp = await axiosInstance.post(getAccessToken, {
        //   platform_url: "https://platform.uniqgrid.com/api",
        // });
        // localStorage.setItem("UGXAuthorization", resp.data.access_token);

        toast.success("Logged in successfully");
        navigate("/groups", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();
  return (
    <Flex
      h="100vh"
      w="100%"
      align="center"
      justify="center"
      px={{ base: "4", md: "12" }}
    >
      <Card
        bg={cardBg}
        boxShadow={cardShadow}
        w={{ base: "100%", md: "600px" }}
        p={{ base: 8, md: 12 }}
        borderRadius="20px"
      >
        <Box mb={10}>
          <Heading
            color={textColor}
            fontSize={{ base: "2xl", md: "3xl" }}
            mb="6"
          >
            Sign In
          </Heading>
          <Text color={textColorSecondary} fontSize="md">
            Sign in to access your dashboard
          </Text>
        </Box>

        {/* Username */}
        <FormControl isRequired mb="6">
          <FormLabel fontWeight="600" fontSize="md" color={textColor}>
            Username{" "}
            <Text as="span" color={brandStars}>
              *
            </Text>
          </FormLabel>
          <Input
            name="username"
            type="text"
            size="lg"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            _focus={{ borderColor: inputFocusBorder }}
          />
        </FormControl>

        {/* Password */}
        <FormControl isRequired mb="4">
          <FormLabel fontWeight="600" fontSize="md" color={textColor}>
            Password{" "}
            <Text as="span" color={brandStars}>
              *
            </Text>
          </FormLabel>
          <InputGroup size="lg">
            <Input
              name="password"
              placeholder="********"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              _focus={{ borderColor: inputFocusBorder }}
            />
            <InputRightElement h="full" display="flex" alignItems="center">
              <Icon
                as={showPassword ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                onClick={handleClick}
                cursor="pointer"
                color={textColorSecondary}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* Forgot Password */}
        <Flex justify="flex-end" mb="6">
          <Link
            fontSize="sm"
            color={brandStars}
            _hover={{ textDecoration: "underline" }}
          >
            Forgot password?
          </Link>
        </Flex>

        {/* Submit Button */}
        <Button
          w="100%"
          size="lg"
          fontWeight="700"
          color="white"
          bg="brand.500"
          _hover={{ bg: buttonHoverBg }}
          isLoading={isLoading}
          loadingText="Signing In..."
          onClick={handleLogin}
        >
          Sign In
        </Button>
      </Card>
    </Flex>
  );
};

export default Auth;