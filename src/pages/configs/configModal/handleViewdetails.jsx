import React, { useState, useMemo } from "react";
import GlobalModal from "../../../components/modals/GlobalModal";
import GlobalTable from "../../../components/table/GlobalTable";

const parameterColumns = [
  { label: "Name", render: (row) => row.name },
  { label: "Type", render: (row) => row.type },
  { label: "Action", render: (row) => row.action },
  { label: "Factor", render: (row) => row.factor },
  { label: "Offset", render: (row) => row.offset },
  { label: "Address", render: (row) => row.address },
  { label: "Fn Code", render: (row) => row.fn_code },
  { label: "Write Fn Code", render: (row) => row.write_fn_code },
  { label: "Register Count", render: (row) => row.register_count },
  { label: "Register Data Type", render: (row) => row.register_data_type },
];

const getParameters = (config) => {
  if (!config?.slaves_details) return [];
  return config.slaves_details.flatMap(
    (slave) => slave.slave_data?.parameters || []
  );
};

const ConfigModal = ({ isOpen, onClose, selectedConfig }) => {
  const [searchText, setSearchText] = useState("");
  const parameters = useMemo(() => {
    const allParams = getParameters(selectedConfig);
    if (!searchText) return allParams;
    const lower = searchText.toLowerCase();
    return allParams.filter((param) =>
      Object.values(param).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(lower)
      )
    );
  }, [selectedConfig, searchText]);

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedConfig ? `Parameters for ${selectedConfig.name}` : ""}
      width="80%"
    >
      <GlobalTable
        columns={parameterColumns}
        data={parameters}
        emptyText="No parameters found."
        isLoading={false}
        title="Parameters"
        showSearchBar={true}
        searchText={searchText}
        setSearchText={setSearchText}
        pagination={true}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </GlobalModal>
  );
};

export default ConfigModal;
