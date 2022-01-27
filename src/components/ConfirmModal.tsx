import { RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";

import {
  Divider,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useColorMode,
} from "@chakra-ui/react";

import { Button } from "./form/Button";

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
  const { colorMode } = useColorMode();

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="md" isCentered>
      <ModalOverlay />
      <ModalContent
        mx="2"
        bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
      >
        <ModalHeader>
          <Text fontSize="xl" fontWeight="bold">
            Atenção!
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody px={["2", "6"]}>
          <Divider
            mb="4"
            bordercolor={
              colorMode === "dark" ? "grayDark.700" : "grayLight.700"
            }
          />

          <Text fontSize="lg">{message}</Text>

          <Divider
            mt="4"
            bordercolor={
              colorMode === "dark" ? "grayDark.700" : "grayLight.700"
            }
          />
        </ModalBody>

        <ModalFooter px={["2", "6"]} mt="2" justifyContent="space-between">
          <SimpleGrid flex="1" gap="4" minChildWidth={100} align="flex-start">
            <Button
              label="Cancelar"
              colorScheme={colorMode === "light" ? "grayLight" : "grayDark"}
              onClick={onClose}
              leftIcon={<Icon as={RiCloseCircleLine} fontSize="20" />}
            />

            <Button
              label="Prosseguir"
              colorScheme="red"
              onClick={handleConfirm}
              leftIcon={<Icon as={RiCheckboxCircleLine} fontSize="20" />}
            />
          </SimpleGrid>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export { ConfirmModal };
