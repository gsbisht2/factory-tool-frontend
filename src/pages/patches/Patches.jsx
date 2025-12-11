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
import { patchesDetails, modifyPatch } from "../../api/apiUrls";
import GlobalAlertDialog from "../../components/modals/GlobalAlertDialog";
import { toast } from "react-toastify";

const Patches = () => {
  const [patches, setPatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const [setDefaultLoadingId, setSetDefaultLoadingId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [pendingDefaultPatch, setPendingDefaultPatch] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const optionText = useColorModeValue("navy.800", "white");
  const pageSize = 9;
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearchText]);

  const fetchPatches = useCallback(
    async (search = "", reset = false, pageNumber = 0) => {
      setLoading(true);
      setError(null);
      try {
        const params = { page: pageNumber + 1, page_size: pageSize }; // Send page_size to API
        if (search) params.searchText = search;
        const res = await axiosInstance.get(patchesDetails, { params });
        const results = res.data.results || [];

        // Transform data to match ComplexTable format
        const transformedPatches = results.map((patch) => ({
          filename: patch.filename,
          isDefault: patch.is_default ? "Yes" : "No",
          group: patch.group,
          raw: patch,
        }));

        setPatches(transformedPatches);
        setNextPageUrl(res.data.next);
        setPrevPageUrl(res.data.previous);
        setPage(pageNumber);
        setTotalCount(res.data.count || 0);
        if (res.data.count) {
          setPageCount(Math.ceil(res.data.count / pageSize));
        } else {
          setPageCount(1);
        }
      } catch (err) {
        setError("Failed to fetch patches.");

        setPatches([]);
        setPageCount(1);
        setTotalCount(0);
      }
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    fetchPatches(debouncedSearchText, false, page);
  }, [debouncedSearchText, page, fetchPatches]);

  const handleSetAsDefaultClick = (row) => {
    setPendingDefaultPatch(row.raw);
    setAlertOpen(true);
  };

  const handleConfirmSetAsDefault = async () => {
    if (!pendingDefaultPatch) return;
    setSetDefaultLoadingId(pendingDefaultPatch.id);
    setError(null);
    try {
      const url = modifyPatch.replace("{patch_id}", pendingDefaultPatch.id);
      await axiosInstance.post(url);

      // Refresh patches after setting default
      await fetchPatches(debouncedSearchText, false, page);
      toast.success(`Patch ${pendingDefaultPatch.filename} set as default.`);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to set as default.";
      toast.error(msg);
      setError("Failed to set as default.");
    }
    setSetDefaultLoadingId(null);
    setAlertOpen(false);
    setPendingDefaultPatch(null);
  };

  const patchColumns = useMemo(
    () => [
      { accessorKey: "filename", header: () => <Text>Patch Name</Text> },

      { accessorKey: "group", header: () => <Text>Group</Text> },

      { accessorKey: "isDefault", header: () => <Text>Is Default</Text> },
      {
        accessorKey: "action",
        header: () => <Text>Action</Text>,
        cell: (info) => {
          const row = info.row.original;
          return (
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
          Patches Configuration
        </Heading>
      </Flex>

      <ComplexTable
        columnsData={patchColumns}
        title="Patches"
        tableData={patches}
        loading={loading}
        fetchAllDevices={fetchPatches}
        hasNext={!!nextPageUrl}
        currentPage={page}
        totalCount={totalCount}
        pageCount={pageCount}
      />

      <GlobalAlertDialog
        isOpen={alertOpen}
        onClose={() => {
          setAlertOpen(false);
          setPendingDefaultPatch(null);
        }}
        onConfirm={handleConfirmSetAsDefault}
        title="Set as Default"
        body={
          pendingDefaultPatch
            ? `Are you sure you want to set "${pendingDefaultPatch.filename}" as the default patch?`
            : ""
        }
        confirmText="Yes"
        cancelText="Cancel"
        isLoading={!!setDefaultLoadingId}
      />
    </>
  );
};

export default Patches;
