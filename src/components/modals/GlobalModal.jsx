import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
} from "@chakra-ui/react";

const GlobalModal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "xl",
  minWidth,
  height,
  width,
  ...rest
}) => {
  const bg = useColorModeValue("white", "navy.700");
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} isCentered {...rest}>
      <ModalOverlay bg="rgba(0, 0, 0, 0.7)" />
      <ModalContent
        bg={bg}
        minWidth={minWidth}
        p={3}
        height={height}
        maxW="100vw" // full browser width
        width={width}
      >
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};

export default GlobalModal;
