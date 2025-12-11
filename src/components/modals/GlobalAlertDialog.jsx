import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRef } from "react";

const GlobalAlertDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  body,
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = true,
  isLoading = false,
}) => {
  const cancelRef = useRef();

  const bg = useColorModeValue("white", "navy.700");

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent bg={bg}>
          {title && (
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>
          )}
          <AlertDialogBody>{body}</AlertDialogBody>
          <AlertDialogFooter>
            {showCancel && (
              <Button
                ref={cancelRef}
                colorScheme="red"
                variant={"outline"}
                onClick={onClose}
              >
                {cancelText}
              </Button>
            )}
            <Button
              colorScheme="blue"
              onClick={onConfirm}
              ml={3}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default GlobalAlertDialog;
