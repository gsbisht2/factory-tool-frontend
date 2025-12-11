import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Heading,
  Box,
  Flex,
  useColorModeValue,
  Text,
  SimpleGrid,
  Icon,
  Button,
  Input,
  Textarea,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import MiniStatistics from "../../components/Card/MiniStatistics";
import IconBox from "../../components/icons/IconBox";
import ComplexTable from "../../components/table/ComplexTable";
import { MdGroup, MdDevices, MdRouter, MdDelete, MdEdit } from "react-icons/md";
import axiosInstance from "../../api/axiosInstance";
import {
  groupDetails,
  addNewGroup,
  deleteGroup,
  editGroup as editGroupUrl,
} from "../../api/apiUrls";
import { FaUser, FaUsers } from "react-icons/fa";
import GlobalModal from "../../components/modals/GlobalModal";
import GlobalAlertDialog from "../../components/modals/GlobalAlertDialog";
import GlobalTable from "../../components/table/GlobalTable";

const pageSize = 9; // Fixed page size for pagination

const Groups = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summaryStats, setSummaryStats] = useState({
    total_groups: 0,
    total_devices: 0,
    device_types: {},
  });

  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

  const [page, setPage] = useState(0); // Change to 0-based indexing to match ComplexTable
  const [pageCount, setPageCount] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState(""); // error state
  const [deletingGroup, setDeletingGroup] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null); // { id, name } or null
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [editJson, setEditJson] = useState(""); // new state for JSON editing
  const [editError, setEditError] = useState(""); // error state for JSON

  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [editedGroupName, setEditedGroupName] = useState("");
  const [editGroupNameError, setEditGroupNameError] = useState("");

  const [interfacesModalOpen, setInterfacesModalOpen] = useState(false);
  const [selectedInterfaces, setSelectedInterfaces] = useState([]);
  // Add state for table columns
  const [interfacesTableColumns, setInterfacesTableColumns] = useState([]);
  const [interfacesTableData, setInterfacesTableData] = useState([]);

  // Add state for interfaces table search and pagination
  const [interfacesSearchText, setInterfacesSearchText] = useState("");
  const [interfacesPage, setInterfacesPage] = useState(0);
  const interfacesPageSize = 10;

  // New state for JSON input in add modal
  const [newGroupJson, setNewGroupJson] = useState("");
  const [newGroupJsonError, setNewGroupJsonError] = useState(""); // error state for JSON in add modal

  const toast = useToast();
  const { colorMode } = useColorMode();

  const optionText = useColorModeValue("navy.800", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchText(searchText), 400);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Reset page when search or selected group changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchText, selectedGroup]);

  const fetchGroups = useCallback(
    async (search = "", reset = false, pageNumber = 0) => {
      setLoading(true);
      try {
        const params = { page: pageNumber + 1, page_size: pageSize }; // Send page_size to API
        if (selectedGroup) params.group = selectedGroup;
        if (search) params.searchText = search;

        const res = await axiosInstance.get(groupDetails, { params });

        const results = res.data.results || {};
        const groups = results.groups_data || [];

        const rows = groups.map((g) => {
          let deviceCount = 0;
          let deviceId = "-";
          if (g.devices && typeof g.devices === "object") {
            Object.values(g.devices).forEach((arr) => {
              deviceCount += Array.isArray(arr) ? arr.length : 0;
              if (Array.isArray(arr) && arr.length > 0 && arr[0].device_id) {
                deviceId = arr[0].device_id;
              }
            });
          }
          return {
            name: g.name,
            wifiConfigs: g.peripheral_configs?.wifi_config ? 1 : 0,
            ethernetConfigs: g.peripheral_configs?.ethernet_config ? 1 : 0,
            modbusTcpConfigs: g.peripheral_configs?.modbustcp_config ? 1 : 0,
            devices: deviceCount,
            deviceId,
            patches: Array.isArray(g.patches) ? g.patches.length : 0,
            modbusConfigs: Array.isArray(g.modbus_configs)
              ? g.modbus_configs.length
              : 0,
            raw: g,
          };
        });

        setDevices(rows);
        setNextPageUrl(res.data.next);
        setPrevPageUrl(res.data.previous);
        setPage(pageNumber);
        setTotalCount(res.data.count);

        // Calculate pageCount using fixed pageSize
        if (res.data.count) {
          setPageCount(Math.ceil(res.data.count / pageSize));
        } else {
          setPageCount(1);
        }

        const deviceTypeCounts = results.devices_count_info || {};
        setSummaryStats({
          total_groups: results.total_groups || 0,
          total_devices: results.total_devices || 0,
          device_types: results.device_types || {},
          ...deviceTypeCounts,
        });
      } catch (err) {
        console.error(err);
        // --- SAMPLE DATA FALLBACK REMOVED ---
        setDevices([]);
        setSummaryStats({
          total_groups: 0,
          total_devices: 0,
          device_types: {},
        });
        setPageCount(1);
        setTotalCount(0);
        setNextPageUrl(null);
        setPrevPageUrl(null);
      } finally {
        setLoading(false);
      }
    },
    [selectedGroup]
  );

  useEffect(() => {
    fetchGroups(debouncedSearchText, false, page);
  }, [debouncedSearchText, page, fetchGroups]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setNewGroupName("");
    setNewGroupJson(""); // reset JSON input
    setNewGroupJsonError(""); // reset JSON error
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewGroupName("");
    setNewGroupJson("");
    setNewGroupJsonError("");
  };

  const handleGroupNameChange = (e) => {
    const value = e.target.value;
    setNewGroupName(value);
    if (!/^[A-Za-z0-9_-]*$/.test(value)) {
      setGroupNameError(
        "Name can only contain letters, numbers, hyphens (-), and underscores (_). No spaces allowed."
      );
    } else {
      setGroupNameError("");
    }
  };

  const handleNewGroupJsonChange = (e) => {
    setNewGroupJson(e.target.value);
    setNewGroupJsonError("");
  };

  const handleSubmitGroup = async () => {
    if (groupNameError || !newGroupName) return;
    // Validate JSON if provided
    let parsedJson = {};
    if (newGroupJson.trim()) {
      try {
        parsedJson = JSON.parse(newGroupJson);
      } catch (err) {
        setNewGroupJsonError("Invalid JSON format.");
        return;
      }
    }
    try {
      // Assign parsedJson to peripheral_configs
      const payload = { name: newGroupName };
      if (Object.keys(parsedJson).length > 0) {
        payload.peripheral_configs = parsedJson;
      }
      await axiosInstance.post(addNewGroup, payload);
      toast({
        title: "Group added",
        description: `Group "${newGroupName}" has been added.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      handleCloseModal();
      fetchGroups(debouncedSearchText, false, page); // refresh data
    } catch (err) {
      toast({
        title: "Failed to add group",
        description: err?.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      console.error("Failed to add group:", err);
    }
  };

  const handleDeleteIconClick = (group) => {
    setGroupToDelete({ id: group.raw.id, name: group.name });
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
    setGroupToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!groupToDelete?.id) return;
    setDeletingGroup(groupToDelete.name);
    try {
      await axiosInstance.delete(
        deleteGroup.replace("{group_id}", groupToDelete.id)
      );
      toast({
        title: "Group deleted",
        description: `Group "${groupToDelete.name}" has been deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchGroups(debouncedSearchText, false, page);
    } catch (err) {
      toast({
        title: "Failed to delete group",
        description: err?.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      console.error("Failed to delete group:", err);
    } finally {
      setDeletingGroup(null);
      handleAlertClose();
    }
  };

  // Add edit handler
  const handleEditIconClick = (group) => {
    setEditGroup(group.raw);
    // Show the group's actual peripheral_configs as JSON, or empty if not present
    setEditJson(
      group.raw.peripheral_configs
        ? JSON.stringify(group.raw.peripheral_configs, null, 2)
        : ""
    );
    setEditError("");
    setIsEditingGroupName(true);
    setEditedGroupName(group.raw.name || "");
    setEditGroupNameError("");
    setEditModalOpen(true);
  };

  // Handle JSON change
  const handleEditJsonChange = (e) => {
    setEditJson(e.target.value);
    setEditError("");
  };

  // Handle submit edit
  const handleEditSubmit = async () => {
    // Validate JSON first
    let parsed;
    try {
      parsed = JSON.parse(editJson);
    } catch (err) {
      setEditError("Invalid JSON format.");
      return;
    }

    // Validate group name if editing
    if (isEditingGroupName && (editGroupNameError || !editedGroupName)) {
      setEditError("Please fix the group name before saving.");
      return;
    }

    try {
      // Assign parsed to peripheral_configs
      const payload = {};
      if (isEditingGroupName) {
        payload.name = editedGroupName;
      }
      payload.peripheral_configs = parsed;

      await axiosInstance.put(
        editGroupUrl.replace("{group_id}", editGroup.id),
        payload
      );
      toast({
        title: "Group updated",
        description: `Group "${
          isEditingGroupName ? editedGroupName : editGroup?.name
        }" has been updated.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setEditModalOpen(false);
      setIsEditingGroupName(false);
      setEditGroupNameError("");
      setEditedGroupName("");
      fetchGroups(debouncedSearchText, false, page);
    } catch (err) {
      setEditError(
        err?.response?.data?.message ||
          "Failed to update group. Please try again."
      );
      console.error("Failed to update group:", err);
    }
  };

  const handleEditGroupNameIconClick = () => {
    setIsEditingGroupName(true);
    setEditedGroupName(editGroup?.name || "");
    setEditGroupNameError("");
  };

  const handleEditGroupNameChange = (e) => {
    const value = e.target.value;
    setEditedGroupName(value);
    if (!/^[A-Za-z0-9_-]*$/.test(value)) {
      setEditGroupNameError(
        "Name can only contain letters, numbers, hyphens (-), and underscores (_). No spaces allowed."
      );
    } else {
      setEditGroupNameError("");
    }
  };

  const handleEditGroupNameCancel = () => {
    setIsEditingGroupName(false);
    setEditedGroupName("");
    setEditGroupNameError("");
  };

  const handleViewInterfaces = (group) => {
    const interfaces = group.raw.interfaces || [];
    setSelectedInterfaces(interfaces);

    // Prepare columns
    let columns = [{ label: "Name", render: (row) => row.name || "-" }];
    // Find all unique keys in settings
    const allKeys = Array.from(
      new Set(
        interfaces.flatMap((iface) =>
          iface.settings ? Object.keys(iface.settings) : []
        )
      )
    );
    columns = columns.concat(
      allKeys.map((key) => ({
        label: key,
        render: (row) =>
          row.settings && key in row.settings ? String(row.settings[key]) : "-",
      }))
    );
    setInterfacesTableColumns(columns);

    // Prepare data
    setInterfacesTableData(interfaces);

    setInterfacesModalOpen(true);
  };

  const handleCloseInterfacesModal = () => {
    setInterfacesModalOpen(false);
    setSelectedInterfaces([]);
    setInterfacesTableColumns([]);
    setInterfacesTableData([]);
  };

  // Filtered and paginated interfaces data
  const filteredInterfacesData = useMemo(() => {
    if (!interfacesTableData || interfacesTableData.length === 0) return [];
    if (!interfacesSearchText) return interfacesTableData;
    const lower = interfacesSearchText.toLowerCase();
    return interfacesTableData.filter((iface) =>
      Object.values(iface).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(lower)
      )
    );
  }, [interfacesTableData, interfacesSearchText]);

  const paginatedInterfacesData = useMemo(() => {
    const start = interfacesPage * interfacesPageSize;
    return filteredInterfacesData.slice(start, start + interfacesPageSize);
  }, [filteredInterfacesData, interfacesPage, interfacesPageSize]);

  const interfacesPageCount = Math.ceil(
    filteredInterfacesData.length / interfacesPageSize
  );

  // Reset page when search changes
  useEffect(() => {
    setInterfacesPage(0);
  }, [interfacesSearchText, interfacesTableData]);

  const deviceColumns = useMemo(() => {
    if (!devices || devices.length === 0) return [];
    return [
      { accessorKey: "name", header: () => <Text>Name</Text> },
      { accessorKey: "wifiConfigs", header: () => <Text>WiFi Configs</Text> },
      {
        accessorKey: "ethernetConfigs",
        header: () => <Text>Ethernet Configs</Text>,
      },
      {
        accessorKey: "modbusTcpConfigs",
        header: () => <Text>ModbusTCP Configs</Text>,
      },
      { accessorKey: "devices", header: () => <Text>Number of Devices</Text> },
      // { accessorKey: "deviceId", header: () => <Text>Device ID</Text> },
      { accessorKey: "patches", header: () => <Text>Number of Patches</Text> },
      {
        accessorKey: "modbusConfigs",
        header: () => <Text>Number of Modbus Configs</Text>,
      },
      {
        accessorKey: "interfaces",
        header: () => <Text>Interfaces</Text>,
        cell: ({ row }) => (
          <Button
            size="sm"
            colorScheme="purple"
            variant="outline"
            onClick={() => handleViewInterfaces(row.original)}
          >
            View Details
          </Button>
        ),
      },
      {
        accessorKey: "action",
        header: () => <Text>Action</Text>,
        cell: ({ row }) => (
          <Flex>
            <Button
              variant="ghost"
              size="sm"
              colorScheme="blue"
              onClick={() => handleEditIconClick(row.original)}
              aria-label="Edit group"
            >
              <Icon as={MdEdit} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              colorScheme="red"
              isLoading={deletingGroup === row.original.name}
              onClick={() => handleDeleteIconClick(row.original)}
              aria-label="Delete group"
            >
              <Icon as={MdDelete} />
            </Button>
          </Flex>
        ),
      },
    ];
  }, [devices, deletingGroup]);

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
          Groups Configurations
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
          Add new group
        </Button>
      </Flex>

      {/* Summary cards */}
      <Box px={2}>
        <SimpleGrid
          columns={{ base: 1, md: 3, lg: 5, "2xl": 5 }}
          gap="20px"
          mb="20px"
        >
          <MiniStatistics
            name="Total Groups"
            value={summaryStats.total_groups}
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={<Icon as={FaUsers} color="blue.400" w="32px" h="32px" />}
              />
            }
          />
          <MiniStatistics
            name="Total Devices"
            value={summaryStats.total_devices}
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon as={MdDevices} color="green.400" w="32px" h="32px" />
                }
              />
            }
          />
          {summaryStats.device_types &&
            Object.entries(summaryStats.device_types).map(
              ([typeId, typeName]) => {
                const count = summaryStats[typeName] || 0;
                return (
                  <MiniStatistics
                    key={typeId}
                    name={`${typeName} Devices`}
                    value={count}
                    startContent={
                      <IconBox
                        w="56px"
                        h="56px"
                        bg={boxBg}
                        icon={
                          <Icon
                            as={MdRouter}
                            color="purple.400"
                            w="32px"
                            h="32px"
                          />
                        }
                      />
                    }
                  />
                );
              }
            )}
        </SimpleGrid>
      </Box>

      {/* Devices table */}
      <ComplexTable
        columnsData={deviceColumns}
        title="Groups"
        tableData={devices}
        loading={loading}
        fetchAllDevices={fetchGroups}
        hasNext={!!nextPageUrl}
        currentPage={page}
        totalCount={totalCount}
        pageCount={pageCount}
      />
      <GlobalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Group"
        width="30%"
        footer={
          <Button
            size="sm"
            colorScheme="purple"
            variant="outline"
            onClick={handleSubmitGroup}
            isDisabled={
              !newGroupName || !!groupNameError || !!newGroupJsonError
            }
          >
            Submit
          </Button>
        }
      >
        <Input
          placeholder="Enter group name"
          value={newGroupName}
          onChange={handleGroupNameChange}
          autoFocus
          variant="search"
          fontSize="sm"
          borderRadius="1rem"
          border="2px lightgray solid"
          fontWeight="500"
          outline="none"
          _focus={{ boxShadow: "none" }}
          _placeholder={{ color: "gray.400", fontSize: "14px" }}
          isInvalid={!!groupNameError}
          color={colorMode === "dark" ? "white" : undefined}
        />
        {groupNameError && (
          <Text color="red.500" fontSize="sm" mt={2}>
            {groupNameError}
          </Text>
        )}
        {/* Add JSON textarea for new group */}
        <Textarea
          value={newGroupJson}
          onChange={handleNewGroupJsonChange}
          placeholder="Paste your JSON here"
          rows={8}
          fontFamily="mono"
          height={"300px"}
          fontSize="sm"
          borderRadius="1rem"
          border="2px lightgray solid"
          fontWeight="500"
          outline="none"
          _focus={{ boxShadow: "none" }}
          color={colorMode === "dark" ? "white" : undefined}
          mt={4}
          sx={{
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        />
        {newGroupJsonError && (
          <Text color="red.500" fontSize="sm" mt={2}>
            {newGroupJsonError}
          </Text>
        )}
      </GlobalModal>
      <GlobalAlertDialog
        isOpen={alertOpen}
        onClose={handleAlertClose}
        onConfirm={handleConfirmDelete}
        title="Delete Group"
        body={`Are you sure you want to delete group "${groupToDelete?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        showCancel={true}
        isLoading={!!deletingGroup}
      />
      <GlobalModal
        isOpen={editModalOpen}
        width="30%"
        onClose={() => setEditModalOpen(false)}
        title={
          <Box>
            <Text fontWeight="bold" fontSize="lg" mb={2}>
              Edit Group
            </Text>
            <Input
              value={editedGroupName}
              onChange={handleEditGroupNameChange}
              variant="search"
              fontSize="sm"
              borderRadius="1rem"
              border="2px lightgray solid"
              fontWeight="500"
              outline="none"
              _focus={{ boxShadow: "none" }}
              _placeholder={{ color: "gray.400", fontSize: "14px" }}
              isInvalid={!!editGroupNameError}
              color={colorMode === "dark" ? "white" : undefined}
              mr={2}
              placeholder="Group Name"
            />
            {editGroupNameError && (
              <Text color="red.500" fontSize="sm" mt={2} height="10">
                {editGroupNameError}
              </Text>
            )}
          </Box>
        }
        footer={
          <>
            <Button
              size="sm"
              colorScheme="purple"
              variant="outline"
              onClick={handleEditSubmit}
              isDisabled={
                !editJson ||
                !!editError ||
                !!editGroupNameError ||
                !editedGroupName
              }
              mr={2}
            >
              Save
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
          </>
        }
      >
        <Box>
          {/* <Text mb={2}>Edit group JSON:</Text> */}
          {/* Use Chakra Textarea for better height and style */}
          <Textarea
            value={editJson}
            onChange={handleEditJsonChange}
            placeholder="Paste your JSON here..."
            rows={8}
            fontFamily="mono"
            height={"300px"}
            fontSize="sm"
            borderRadius="1rem"
            border="2px lightgray solid"
            fontWeight="500"
            outline="none"
            _focus={{ boxShadow: "none" }}
            color={colorMode === "dark" ? "white" : undefined}
            sx={{
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          />
          {editError && (
            <Text color="red.500" fontSize="sm" mt={2}>
              {editError}
            </Text>
          )}
        </Box>
      </GlobalModal>
      <GlobalModal
        isOpen={interfacesModalOpen}
        width="80%"
        onClose={handleCloseInterfacesModal}
        title="Interface Settings"
        footer={
          <Button
            onClick={handleCloseInterfacesModal}
            size="sm"
            colorScheme="purple"
            variant="outline"
          >
            Close
          </Button>
        }
        size="6xl"
      >
        {selectedInterfaces.length === 0 ? (
          <Text>No interfaces found for this group.</Text>
        ) : (
          <Box>
            <GlobalTable
              columns={interfacesTableColumns}
              data={paginatedInterfacesData}
              title="Interfaces"
              isLoading={false}
              emptyText="No interface settings found."
              showSearchBar={true}
              searchText={interfacesSearchText}
              // rowsPerPage={interfacesPageSize}
              setSearchText={setInterfacesSearchText}
              currentPage={interfacesPage}
              pageCount={interfacesPageCount}
              setPage={setInterfacesPage}
              tableProps={{ size: "sm" }}
            />
          </Box>
        )}
      </GlobalModal>
    </>
  );
};

export default Groups;
