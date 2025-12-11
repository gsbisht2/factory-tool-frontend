import {
  Button,
  Heading,
  useColorModeValue,
  Box,
  Text,
  Input,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import React, { useMemo, useState, useEffect } from "react";
import ComplexTable from "../../components/table/ComplexTable";
import GlobalModal from "../../components/modals/GlobalModal";
import axiosInstance from "../../api/axiosInstance";
import { getUsers, addNewuser } from "../../api/apiUrls";

const userColumns = [
  { accessorKey: "email", header: () => <Text>Email</Text> },

  {
    accessorKey: "username",
    header: () => <Text>Username</Text>,
    cell: ({ row }) => (
      <Text>{row.original.username ? row.original.username : "-"}</Text>
    ),
  },
  //   { accessorKey: "permission", header: () => <Text>Permission</Text> },
];

const UserManagement = () => {
  const optionText = useColorModeValue("navy.800", "white");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEmail("");
    setPassword("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail("");
    setPassword("");
  };

  const handleSubmitUser = async () => {
    try {
      await axiosInstance.post(addNewuser, { email, password });
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      handleCloseModal();
    }
  };

  const fetchUsers = () => {
    setLoading(true);
    axiosInstance
      .get(getUsers)
      .then((res) => {
        setUsers(res.data);
      })
      .catch(() => {
        setUsers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const { colorMode } = useColorMode();

  return (
    <>
      <Flex
        h="auto"
        align="center"
        justify="space-between"
        color={optionText}
        fontSize="lg"
        px={4}
        mb={4}
      >
        <Heading size="lg" mt={3} mb={6}>
          User Management
        </Heading>
        <Button
          size="sm"
          colorScheme="blue"
          variant="outline"
          borderWidth="2px"
          borderColor="blue.200"
          color="blue.400"
          cursor="pointer"
          onClick={handleOpenModal}
        >
          Add new user
        </Button>
      </Flex>
      <Box px={2}>
        <ComplexTable
          columnsData={userColumns}
          tableData={users}
          title="Users"
          loading={loading}
          fetchAllDevices={() => {}}
          hasNext={false}
          currentPage={0}
          totalCount={users.length}
          pageCount={1}
        />
      </Box>
      <GlobalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New User"
        width="30%"
        footer={
          <Button
            colorScheme="blue"
            onClick={handleSubmitUser}
            isDisabled={!email || !password}
          >
            Submit
          </Button>
        }
      >
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb={3}
          variant="search"
          fontSize="sm"
          borderRadius="1rem"
          border="2px lightgray solid"
          fontWeight="500"
          outline="none"
          _focus={{ boxShadow: "none" }}
          _placeholder={{ color: "gray.400", fontSize: "14px" }}
          color={colorMode === "dark" ? "white" : undefined}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="search"
          fontSize="sm"
          borderRadius="1rem"
          border="2px lightgray solid"
          fontWeight="500"
          outline="none"
          _focus={{ boxShadow: "none" }}
          _placeholder={{ color: "gray.400", fontSize: "14px" }}
          color={colorMode === "dark" ? "white" : undefined}
        />
      </GlobalModal>
    </>
  );
};

export default UserManagement;
