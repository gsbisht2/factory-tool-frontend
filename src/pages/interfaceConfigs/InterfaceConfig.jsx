import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import InterfaceSelect from "../../components/select";
import ComplexTable from "../../components/table/ComplexTable";

const columns = [
  { accessorKey: "interface", header: "Interface" },
  { accessorKey: "method", header: "Method" },
  { accessorKey: "port", header: "Port" },
  { accessorKey: "baudrate", header: "Baudrate" },
  { accessorKey: "timeout", header: "Timeout" },
  { accessorKey: "parity", header: "Parity" },
  { accessorKey: "stopbit", header: "Stopbit" },
  { accessorKey: "bytesize", header: "Bytesize" },
  { accessorKey: "pollperiod", header: "Poll Period" },
  { accessorKey: "host", header: "Host" },
  { accessorKey: "interfaceType", header: "Interface" },
  { accessorKey: "action", header: "Action" },
];

const configTableData = {
  "Config A": [
    {
      interface: "A1",
      method: "TCP",
      port: "8080",
      baudrate: "9600",
      timeout: "1000",
      parity: "None",
      stopbit: "1",
      bytesize: "8",
      pollperiod: "500",
      host: "192.168.1.1",
      interfaceType: "Ethernet",
      action: "Edit",
    },
    // ...add more rows as needed
  ],
  "Config B": [
    {
      interface: "B1",
      method: "Serial",
      port: "COM3",
      baudrate: "115200",
      timeout: "2000",
      parity: "Even",
      stopbit: "2",
      bytesize: "7",
      pollperiod: "1000",
      host: "localhost",
      interfaceType: "RS232",
      action: "Edit",
    },
    // ...add more rows as needed
  ],
  "Config C": [
    {
      interface: "C1",
      method: "UDP",
      port: "9000",
      baudrate: "4800",
      timeout: "1500",
      parity: "Odd",
      stopbit: "1",
      bytesize: "8",
      pollperiod: "750",
      host: "10.0.0.1",
      interfaceType: "Ethernet",
      action: "Edit",
    },
    // ...add more rows as needed
  ],
};

const InterfaceConfig = () => {
  const optionText = useColorModeValue("navy.800", "white");
  const configOptions = ["Config A", "Config B", "Config C"];
  const [selectedConfig, setSelectedConfig] = React.useState(configOptions[0]);
  const [tableData, setTableData] = React.useState(
    configTableData[selectedConfig]
  );

  React.useEffect(() => {
    setTableData(configTableData[selectedConfig]);
  }, [selectedConfig]);

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
          Interface Configurations
        </Heading>
        <InterfaceSelect
          value={selectedConfig}
          options={configOptions}
          onChange={setSelectedConfig}
          width="200px"
        />
      </Flex>
      <ComplexTable
        tableData={tableData}
        columnsData={columns}
        loading={false}
        title={`${selectedConfig}`}
        hasNext={false}
        currentPage={0}
        pageCount={1}
        totalCount={tableData.length}
        fetchAllDevices={() => {}}
      />
    </>
  );
};

export default InterfaceConfig;
