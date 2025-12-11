import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Heading,
  Flex,
  useColorModeValue,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import ComplexTable from "../../components/table/ComplexTable";
import GlobalModal from "../../components/modals/GlobalModal";
import { deviceDetails, changeDeviceGroup } from "../../api/apiUrls";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import ToastProvider from "../../components/toastProvider/ToastProvider";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [groups, setGroups] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDevice, setModalDevice] = useState(null);
  const [selectedModalGroup, setSelectedModalGroup] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const optionText = useColorModeValue("navy.800", "white");
  const pageSize = 9; // Fixed page size for pagination

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearchText]);

  const fetchDevices = useCallback(
    async (search = "", reset = false, pageNumber = 0) => {
      setLoading(true);
      setError(null);
      try {
        const params = { page: pageNumber + 1, page_size: pageSize }; // Send page_size to API
        if (search) params.searchText = search;
        const response = await axiosInstance.get(deviceDetails, { params });
        const results = response.data.results || {};
        const devicesData = results.devices || [];
        const mappedDevices = devicesData.map((d) => ({
          deviceId: d.device_id,
          deviceType: d.device_type,
          modbusVersion: d.modbus_version,
          patchVersion: d.patch_version,
          modbusConfig: d.modbus_config_name,
          patch: d.patch_name,
          group: d.group_name,
          groupId: d.group_id,
        }));
        setDevices(mappedDevices);
        setGroups(results.groups || []);
        setNextPageUrl(response.data.next);
        setPrevPageUrl(response.data.previous);
        setPage(pageNumber);
        setTotalCount(response.data.count || 0);
        // Calculate pageCount using fixed pageSize
        if (response.data.count) {
          setPageCount(Math.ceil(response.data.count / pageSize));
        } else {
          setPageCount(1);
        }
      } catch (err) {
        setError("Failed to fetch device details.");
        setDevices([]);
        setGroups([]);
        setPageCount(1);
        setTotalCount(0);
      }
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    fetchDevices(debouncedSearchText, false, page);
  }, [debouncedSearchText, page, fetchDevices]);

  const deviceColumns = useMemo(
    () => [
      { accessorKey: "deviceId", header: () => <Text>Device ID</Text> },

      { accessorKey: "group", header: () => <Text>Group Name</Text> },
      {
        accessorKey: "modbusConfig",
        header: () => <Text>Modbus Config</Text>,
        cell: (info) => info.getValue() || "-",
      },

      { accessorKey: "deviceType", header: () => <Text>Device Type</Text> },

      {
        accessorKey: "modbusVersion",
        header: () => <Text>Modbus Version</Text>,
      },
      {
        accessorKey: "patch",
        header: () => <Text>Patch</Text>,
        cell: (info) => info.getValue() || "-",
      },
      { accessorKey: "patchVersion", header: () => <Text>Patch Version</Text> },
      {
        accessorKey: "groupAction",
        header: () => <Text>Group</Text>,
        cell: (info) => {
          const row = info.row.original;
          return (
            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              borderWidth="2px"
              borderColor="blue.200"
              color="blue.400"
              cursor="pointer"
              onClick={() => {
                setModalDevice(row);
                setSelectedModalGroup(row.groupId || (groups[0]?.id ?? null));
                setModalOpen(true);
              }}
            >
              Manage Group
            </Button>
          );
        },
      },
    ],
    [groups]
  );

  const handleSaveGroupChange = async () => {
    if (!modalDevice || !selectedModalGroup) {
      setModalOpen(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const url = changeDeviceGroup.replace(
        "{device_id}",
        modalDevice.deviceId
      );
      await axiosInstance.post(url, { group_id: selectedModalGroup });

      setDevices((prev) =>
        prev.map((d) =>
          d.deviceId === modalDevice.deviceId
            ? {
                ...d,
                groupId: selectedModalGroup,
                group: groups.find((g) => g.id === selectedModalGroup)?.name,
              }
            : d
        )
      );
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to change device group.";
      setError(msg);
      toast.error(msg);
    }

    setLoading(false);
    setModalOpen(false);
  };

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
          Device Configurations
        </Heading>
      </Flex>

      <ComplexTable
        columnsData={deviceColumns}
        title="Devices"
        tableData={devices}
        loading={loading}
        fetchAllDevices={fetchDevices}
        hasNext={!!nextPageUrl}
        currentPage={page}
        totalCount={totalCount}
        pageCount={pageCount}
      />

      <GlobalModal
        isOpen={modalOpen}
        width="30%"
        onClose={() => setModalOpen(false)}
        title={`Change group for ${modalDevice?.deviceId || ""}`}
        footer={
          <Button
            size="sm"
            colorScheme="purple"
            variant="outline"
            onClick={handleSaveGroupChange}
          >
            Save
          </Button>
        }
      >
        <RadioGroup value={selectedModalGroup} onChange={setSelectedModalGroup}>
          <Stack>
            {groups.map((group) => (
              <Radio key={group.id} value={group.id}>
                {group.name}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </GlobalModal>
    </>
  );
};

export default Devices;
