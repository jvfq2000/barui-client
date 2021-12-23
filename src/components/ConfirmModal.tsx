import { RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";

import {
  Button,
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
      <ModalContent bg="gray.800">
        <ModalHeader mb="6" bg="gray.700">
          <Text fontSize="xl" fontWeight="bold">
            Atenção!
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Text fontSize="lg">{message}</Text>
        </ModalBody>

        <ModalFooter mt="2" justifyContent="space-between">
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
