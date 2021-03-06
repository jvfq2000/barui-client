import Link from "next/link";
import {
  RiDownload2Line,
  RiLockLine,
  RiLockUnlockLine,
  RiPencilLine,
} from "react-icons/ri";
import { useMutation } from "react-query";

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
  useDisclosure,
  useToast,
  Link as ChackraLink,
  useColorMode,
} from "@chakra-ui/react";

import { api } from "../../services/apiClient";
import { IRegulation } from "../../services/hooks/useRegulations";
import { queryClient } from "../../services/queryClient";
import { accessLevel } from "../../utils/permitions";
import { Can } from "../Can";
import { ConfirmModal } from "../ConfirmModal";
import { Button } from "../form/Button";
import { ItemOptionsModal } from "../ItemOptionsModal";

interface IRegulationOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  regulation: IRegulation;
}

function RegulationOptionsModal({
  isOpen,
  onClose,
  regulation,
}: IRegulationOptionsModalProps): JSX.Element {
  const { id, name, inForceFrom, fileUrl, courseName, isActive, createdAt } =
    regulation;

  const { colorMode } = useColorMode();

  const {
    isOpen: isOpenConfirmModal,
    onOpen: onOpenConfirmModal,
    onClose: onCloseConfirmModal,
  } = useDisclosure();

  const msgActivateRegulation =
    "O regulamento poderá ser acessado pelos alunos, deseja prosseguir com a alteração?";
  const msgInactivateRegulation =
    "O regulamento não poderá ser acessado pelos alunos, deseja prosseguir com a alteração?";

  const toast = useToast();

  const changeIsActive = useMutation(
    async () => {
      api
        .patch(`regulations/is-active?regulationId=${id}`)
        .then(() => {
          toast({
            description: "Status do regulamento alterado com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          queryClient.invalidateQueries("regulations");
        })
        .catch(error => {
          toast({
            description: error.response.data.message,
            status: "error",
            position: "top",
            duration: 8000,
            isClosable: true,
          });
        });
    },
    {
      onSuccess: () => {
        onCloseConfirmModal();
      },
    },
  );

  async function handleChangeIsActive(): Promise<void> {
    await changeIsActive.mutateAsync();
  }

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} size="md" isCentered>
        <ModalOverlay />
        <ModalContent
          mx="2"
          bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
        >
          <ModalHeader>
            <Text fontSize="2xl" fontWeight="bold">
              {name}
            </Text>
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody px={["2", "3"]}>
            <Divider mb="4" />

            <ItemOptionsModal label="Curso" value={courseName} />
            <ItemOptionsModal
              label="Em vigor a partir de"
              value={inForceFrom}
            />
            <ItemOptionsModal label="Cadastrado em" value={createdAt} />
            <ItemOptionsModal
              label="Status"
              value={isActive ? "Ativo" : "Inativo"}
            />

            <Divider mt="4" />
          </ModalBody>

          <ModalFooter px={["2", "3"]} mt="2" justifyContent="space-between">
            <SimpleGrid flex="1" gap="4" minChildWidth={100}>
              <Can accessLevel={accessLevel[3]}>
                <Button
                  label={isActive ? "Inativar" : "Ativar"}
                  onClick={() => {
                    onClose();
                    onOpenConfirmModal();
                  }}
                  colorScheme={isActive ? "red" : "green"}
                  leftIcon={
                    <Icon
                      as={isActive ? RiLockLine : RiLockUnlockLine}
                      fontSize="20"
                    />
                  }
                />
              </Can>

              {isActive && (
                <>
                  <Can accessLevel={accessLevel[3]}>
                    <Link
                      href={{
                        pathname: "/regulations/edit",
                        query: { id },
                      }}
                    >
                      <Button
                        label="Alterar"
                        onClick={onClose}
                        colorScheme="blue"
                        leftIcon={<Icon as={RiPencilLine} fontSize="20" />}
                      />
                    </Link>
                  </Can>
                  <ChackraLink href={fileUrl} isExternal>
                    <Button
                      label="Download"
                      onClick={onClose}
                      colorScheme="green"
                      leftIcon={<Icon as={RiDownload2Line} fontSize="20" />}
                    />
                  </ChackraLink>
                </>
              )}
            </SimpleGrid>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmModal
        handleConfirm={handleChangeIsActive}
        isOpen={isOpenConfirmModal}
        onClose={onCloseConfirmModal}
        message={isActive ? msgInactivateRegulation : msgActivateRegulation}
      ></ConfirmModal>
    </>
  );
}

export { RegulationOptionsModal };
