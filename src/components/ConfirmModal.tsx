import { RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";

import {
  Button,
  Divider,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

interface IConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleConfirm: () => void;
  message: string;
}

function ConfirmModal({
  isOpen,
  onClose,
  handleConfirm,
  message,
}: IConfirmModalProps): JSX.Element {
  return (
    <Modal onClose={onClose} isOpen={isOpen} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent mx="2" bg="gray.800">
        <ModalHeader>
          <Text fontSize="xl" fontWeight="bold">
            Atenção!
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody px={["2", "6"]}>
          <Divider mb="4" borderColor="gray.700" />
          <Text fontSize="lg">{message}</Text>
        </ModalBody>

        <ModalFooter px={["2", "6"]} mt="2" justifyContent="space-between">
          <Button
            onClick={onClose}
            colorScheme="whiteAlpha"
            leftIcon={<Icon as={RiCloseCircleLine} fontSize="20" />}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleConfirm}
            colorScheme="red"
            leftIcon={<Icon as={RiCheckboxCircleLine} fontSize="20" />}
          >
            Prosseguir
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export { ConfirmModal };
