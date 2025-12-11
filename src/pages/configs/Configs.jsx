import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Heading,
  Flex,
  useColorModeValue,
  Button,
  Text,
  Spinner,
} from "@chakra-ui/react";
import ComplexTable from "../../components/table/ComplexTable";
import axiosInstance from "../../api/axiosInstance";
import { modbusConfigDetails, modifyConfig } from "../../api/apiUrls";
import ConfigModal from "./configModal/handleViewdetails";
import GlobalAlertDialog from "../../components/modals/GlobalAlertDialog";
import { toast } from "react-toastify";

const Configs = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [setDefaultLoadingId, setSetDefaultLoadingId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [pendingDefaultConfig, setPendingDefaultConfig] = useState(null);

  // Pagination state
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

  const sampleConfigs = [
    {
      interface: "RS485",
      slaveId: "1",
      slaveIp: "192.168.1.10",
      configName: "Sample Config 1",
      group: "A",
      isDefault: "No",
      slaves: "Slave A, Slave B",
      raw: {
        id: "sample-1",
        name: "Sample Config 1",
        is_default: false,
        // ...other fields as needed
      },
    },
    {
      interface: "TCP",
      slaveId: "2",
      slaveIp: "192.168.1.11",
      configName: "Sample Config 2",
      group: "B",
      isDefault: "Yes",
      slaves: "Slave C",
      raw: {
        id: "sample-2",
        name: "Sample Config 2",
        is_default: true,
        // ...other fields as needed
      },
    },
  ];

  // Provide a sample config for modal fallback
  const sampleConfigDetails = {
    id: "sample-1",
    name: "Sample Config 1",
    is_default: false,
    group: "A",
    slaves_details: [
      {
        interface: "RS485",
        slave_data: {
          slave_id: "1",
          slave_ip: "192.168.1.10",
          name: "Slave A",
        },
      },
      {
        interface: "RS485",
        slave_data: {
          slave_id: "2",
          slave_ip: "192.168.1.12",
          name: "Slave B",
        },
      },
    ],
    // ...add more fields as needed for your modal...
  };

  const fetchConfigs = useCallback(
    async (search = "", reset = false, pageNumber = 0) => {
      setLoading(true);
      setError(null);
      try {
        const params = { page: pageNumber + 1, page_size: pageSize }; // Ensure page_size is sent to API
        if (search) params.searchText = search;
        const res = await axiosInstance.get(modbusConfigDetails, { params });

        // Handle paginated response
        const configsData = res.data.results || [];

        // Transform data to match ComplexTable format
        const transformedConfigs = configsData.map((config) => ({
          interface:
            config.slaves_details && config.slaves_details.length > 0
              ? config.slaves_details[0].interface || "-"
              : "-",
          slaveId:
            config.slaves_details &&
            config.slaves_details.length > 0 &&
            config.slaves_details[0].slave_data
              ? config.slaves_details[0].slave_data.slave_id || "-"
              : "-",
          slaveIp:
            config.slaves_details &&
            config.slaves_details.length > 0 &&
            config.slaves_details[0].slave_data
              ? config.slaves_details[0].slave_data.slave_ip || "-"
              : "-",
          configName: config.name,
          group: config.group,
          isDefault: config.is_default ? "Yes" : "No",
          slaves:
            config.slaves_details
              ?.map((s) => s.slave_data?.name || "-")
              .join(", ") || "-",
          raw: config,
        }));

        setConfigs(transformedConfigs);
        setNextPageUrl(res.data.next);
        setPrevPageUrl(res.data.previous);
        setPage(pageNumber);
        setTotalCount(res.data.count || 0);

        // Calculate pageCount using fixed pageSize
        if (res.data.count) {
          setPageCount(Math.ceil(res.data.count / pageSize));
        } else {
          setPageCount(1);
        }
      } catch (err) {
        // Remove sample data fallback
        setConfigs([]);
        setError("Failed to fetch configs.");
        setPageCount(1);
        setTotalCount(0);
      }
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    fetchConfigs(debouncedSearchText, false, page);
  }, [debouncedSearchText, page, fetchConfigs]);

  const handleViewDetails = (row) => {
    setSelectedConfig(row.raw);
    setModalOpen(true);
  };

  const handleSetAsDefaultClick = (row) => {
    setPendingDefaultConfig(row.raw);
    setAlertOpen(true);
  };

  const handleConfirmSetAsDefault = async () => {
    if (!pendingDefaultConfig) return;
    setSetDefaultLoadingId(pendingDefaultConfig.id);
    setError(null);
    try {
      const url = modifyConfig.replace("{config_id}", pendingDefaultConfig.id);
      await axiosInstance.post(url);

      // Refresh configs after setting default
      await fetchConfigs(debouncedSearchText, false, page);
      toast.success(`Config ${pendingDefaultConfig.name} set as default.`);
    } catch (err) {
      setError("Failed to set as default.");
    }
    setSetDefaultLoadingId(null);
    setAlertOpen(false);
    setPendingDefaultConfig(null);
  };

  const configColumns = useMemo(
    () => [
      { accessorKey: "configName", header: () => <Text>Config Name</Text> },

      { accessorKey: "interface", header: () => <Text>Interface</Text> },
      { accessorKey: "group", header: () => <Text>Group</Text> },

      { accessorKey: "slaveId", header: () => <Text>Slave ID</Text> },
      { accessorKey: "slaveIp", header: () => <Text>Slave IP</Text> },
      { accessorKey: "isDefault", header: () => <Text>Is Default</Text> },
      { accessorKey: "slaves", header: () => <Text>Slaves</Text> },
      {
        accessorKey: "action",
        header: () => <Text>Action</Text>,
        cell: (info) => {
          const row = info.row.original;
          return (
            <Flex gap={2}>
              <Button
                size="sm"
                colorScheme="blue"
                variant="outline"
                borderWidth="2px"
                borderColor="blue.200"
                color="blue.400"
                cursor="pointer"
                onClick={() => handleViewDetails(row)}
              >
                View Details
              </Button>
              <Button
                size="sm"
                colorScheme="green"
                variant="outline"
                borderWidth="2px"
                borderColor="green.200"
                color="green.400"
                cursor="pointer"
                onClick={() => handleSetAsDefaultClick(row)}
                isLoading={setDefaultLoadingId === row.raw.id}
                loadingText="Setting..."
                isDisabled={row.raw.is_default || !!setDefaultLoadingId}
              >
                {setDefaultLoadingId === row.raw.id ? (
                  <Spinner size="xs" />
                ) : (
                  "Set as Default"
                )}
              </Button>
            </Flex>
          );
        },
      },
    ],
    [setDefaultLoadingId]
  );

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
          Modbus Configs
        </Heading>
      </Flex>

      <ComplexTable
        columnsData={configColumns}
        title="Modbus Configs"
        tableData={configs}
        loading={loading}
        fetchAllDevices={fetchConfigs}
        hasNext={!!nextPageUrl}
        currentPage={page}
        totalCount={totalCount}
        pageCount={pageCount}
      />

      <ConfigModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedConfig={selectedConfig || sampleConfigDetails}
      />

      <GlobalAlertDialog
        isOpen={alertOpen}
        onClose={() => {
          setAlertOpen(false);
          setPendingDefaultConfig(null);
        }}
        onConfirm={handleConfirmSetAsDefault}
        title="Set as Default"
        body={
          pendingDefaultConfig
            ? `Are you sure you want to set "${pendingDefaultConfig.name}" as the default config?`
            : ""
        }
        confirmText="Yes"
        cancelText="Cancel"
        isLoading={!!setDefaultLoadingId}
      />
    </>
  );
};

export default Configs;
