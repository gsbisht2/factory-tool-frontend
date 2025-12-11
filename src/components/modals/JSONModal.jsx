import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  useColorModeValue,
  VStack,
  FormLabel,
  FormControl,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

const defaultJson = `{
  "port": 443,
  "dev_id": "GXTESTGRIDX",
  "devkey": "uv56we8hu27pd6w0vks1",
  "platform": "https://platform.uniqgrid.com",
  "devsecret": "zbh7w2p24vo25lv5is0u",
  "lte_config": {
    "4G_APN": "xxxxxx.gprs.com",
    "4G_STATE": 1,
    "4G_SIMPIN": "****",
    "4G_SIM_TYPE": 0
  },
  "wifi_config": {
    "Wifi_DNS": "8.8.8.8",
    "Wifi_DHCP": 1,
    "Wifi_PASS1": "air66670",
    "Wifi_PASS2": "",
    "Wifi_PASS3": "",
    "Wifi_PASS4": "",
    "Wifi_PASS5": "",
    "Wifi_SSID1": "Airten_anki_6290",
    "Wifi_SSID2": "",
    "Wifi_SSID3": "",
    "Wifi_SSID4": "",
    "Wifi_SSID5": "",
    "Wifi_ENABLE": 1,
    "Wifi_GATEWAY": "192.168.1.1",
    "Wifi_STATIC_IP": "192.168.1.50",
    "Wifi_SUBNET_MASK": "255.255.255.0"
  },
  "deviceConfig": 1,
  "ethernet_config": {
    "Eth2_DNS": "8.8.8.8",
    "Eth2_DHCP": 0,
    "Eth2_STATE": 1,
    "Eth2_SUBNET": "255.255.255.0",
    "Eth2_GATEWAY": "192.168.1.1",
    "Eth2_STATIC_IP": "192.168.1.55"
  },
  "modbustcp_config": {
    "Eth1_DNS": "8.8.8.8",
    "Eth1_DHCP": 0,
    "Eth1_STATE": 1,
    "Eth1_SUBNET": "255.255.255.0",
    "Eth1_GATEWAY": "192.168.2.1",
    "Eth1_STATIC_IP": "192.168.2.100"
  }
}`;

const JSONModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  title = "Upload JSON",
}) => {
  const bg = useColorModeValue("white", "navy.700");
  const [jsonText, setJsonText] = useState(defaultJson);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef();
  const toast = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file?.name || "");
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setJsonText(evt.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onSubmit(parsed);
    } catch (err) {
      toast({
        title: "Invalid JSON",
        description: "Please provide valid JSON.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setJsonText("");
    setFileName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="lg" isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.7)" />
      <ModalContent bg={bg} p={3}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <Textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder="Paste your JSON here..."
                rows={8}
                fontFamily="mono"
                sx={{
                  /* Hide scrollbar for Chrome, Safari and Opera */
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  /* Hide scrollbar for IE, Edge and Firefox */
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            variant="outline"
            mr={3}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JSONModal;
