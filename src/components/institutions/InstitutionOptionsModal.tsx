import Link from "next/link";
import { RiLockLine, RiLockUnlockLine, RiPencilLine } from "react-icons/ri";
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
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { api } from "../../services/apiClient";
import { IInstitution } from "../../services/hooks/useInstitutions";
import { queryClient } from "../../services/queryClient";
import { ConfirmModal } from "../ConfirmModal";
import { Button } from "../form/Button";
import { ItemOptionsModal } from "../ItemOptionsModal";

interface IInstitutionOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: IInstitution;
}

function InstitutionOptionsModal({
  isOpen,
  onClose,
  institution,
}: IInstitutionOptionsModalProps): JSX.Element {
  const {
    id,
    name,
    isActive,
    createdAt,

    cityName,
    stateName,
  } = institution;

  const { colorMode } = useColorMode();

  const {
    isOpen: isOpenConfirmModal,
    onOpen: onOpenConfirmModal,
    onClose: onCloseConfirmModal,
  } = useDisclosure();

  const msgActivateInstitution =
    "O campus poderá ser utilizado e todos os usuários vinculados a ele terão acesso ao sistema, deseja prosseguir com a alteração?";
  const msgInactivateInstitution =
    "O campus não poderá ser utilizado, e todos os usuários vinculados a ele não poderão acessar o sistema, deseja prosseguir com a alteração?";

  const toast = useToast();

  const changeIsActive = useMutation(
    async () => {
      api
        .patch(`institutions/is-active?institutionId=${id}`)
        .then(() => {
          toast({
            description: "Status do campus alterado com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          queryClient.invalidateQueries("institutions");
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
      <Modal onClose={onClose} isOpen={isOpen} size="sm" isCentered>
        <ModalOverlay />
        <ModalContent
          mx="2"
          bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
        >
          <ModalHeader textAlign="center">
            <Text fontSize="xl" fontWeight="normal">
              {name}
            </Text>
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody px={["2", "3"]} justify="center">
            <Divider
              mb="4"
              bordercolor={
                colorMode === "dark" ? "grayDark.700" : "grayLight.700"
              }
            />

            <ItemOptionsModal label="Estado" value={stateName} />
            <ItemOptionsModal label="Cidade" value={cityName} />
            <ItemOptionsModal
              label="Status"
              value={isActive ? "Ativo" : "Inativo"}
            />
            <ItemOptionsModal label="Cadastrado em" value={createdAt} />

            <Divider
              mt="4"
              bordercolor={
                colorMode === "dark" ? "grayDark.700" : "grayLight.700"
              }
            />
          </ModalBody>

          <ModalFooter px={["2", "3"]} mt="2" justifyContent="space-between">
            <SimpleGrid flex="1" gap="4" minChildWidth={100} align="flex-start">
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

              {isActive && (
                <Link
                  href={{
                    pathname: "/institutions/edit",
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
              )}
            </SimpleGrid>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmModal
        handleConfirm={handleChangeIsActive}
        isOpen={isOpenConfirmModal}
        onClose={onCloseConfirmModal}
        message={isActive ? msgInactivateInstitution : msgActivateInstitution}
      ></ConfirmModal>
    </>
  );
}

export { InstitutionOptionsModal };
