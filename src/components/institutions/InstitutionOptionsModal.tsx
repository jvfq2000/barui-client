import Link from "next/link";
import { RiLockLine, RiLockUnlockLine, RiPencilLine } from "react-icons/ri";
import { useMutation } from "react-query";

import {
  Button,
  Divider,
  HStack,
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
} from "@chakra-ui/react";

import { api } from "../../services/apiClient";
import { IInstitution } from "../../services/hooks/useInstitutions";
import { queryClient } from "../../services/queryClient";
import { ConfirmModal } from "../ConfirmModal";

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

  const {
    isOpen: isOpenConfirmModal,
    onOpen: onOpenConfirmModal,
    onClose: onCloseConfirmModal,
  } = useDisclosure();

  const msgActivateInstitution =
    "O campus e tudo relacionado a ele poderá ser utilizado, até os usuários cadastrados com esse campus voltarão a ter acesso ao sistema, deseja prosseguir com a alteração?";
  const msgInactivateInstitution =
    "O campus e tudo relacionado a ele não poderá mais ser utilizado ou acessado, até os usuários cadastrados com esse campus perderão acesso ao sistema, deseja prosseguir com a alteração?";

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
      <Modal onClose={onClose} isOpen={isOpen} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent mx="2" bg="gray.800">
          <ModalHeader>
            <Text fontSize="2xl" fontWeight="bold">
              {name}
            </Text>
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody px={["2", "3"]} justify="center">
            <Divider mb="4" borderColor="gray.700" />
            <SimpleGrid
              flex="1"
              gap="1"
              minChildWidth="200px"
              align="flex-start"
            >
              <HStack>
                <Text fontSize="lg">Estado:</Text>
                <Text fontSize="lg" color="gray.300">
                  {stateName}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="lg">Cidade:</Text>
                <Text fontSize="lg" color="gray.300">
                  {cityName}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="lg">Cadastrado em:</Text>
                <Text fontSize="lg" color="gray.300">
                  {createdAt}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="lg">Status:</Text>
                <Text fontSize="lg" color="gray.300">
                  {isActive ? "Ativo" : "Inativo"}
                </Text>
              </HStack>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter
            px={["2", "3"]}
            mt="2"
            justifyContent={isActive ? "space-between" : "space-between"}
          >
            <Button
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
            >
              {isActive ? "Inativar" : "Ativar"}
            </Button>

            {isActive && (
              <Link
                href={{
                  pathname: "/institutions/edit",
                  query: { id },
                }}
              >
                <Button
                  onClick={onClose}
                  colorScheme="blue"
                  leftIcon={<Icon as={RiPencilLine} fontSize="20" />}
                >
                  Alterar
                </Button>
              </Link>
            )}
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
