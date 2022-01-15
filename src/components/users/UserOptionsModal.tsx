import Link from "next/link";
import { RiLockLine, RiLockUnlockLine, RiPencilLine } from "react-icons/ri";
import { useMutation } from "react-query";

import {
  Avatar,
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
import { IUser } from "../../services/hooks/useUsers";
import { queryClient } from "../../services/queryClient";
import { ConfirmModal } from "../ConfirmModal";
import { ItemOptionsModal } from "../ItemOptionsModal";

interface IUserOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser;
}

function UserOptionsModal({
  isOpen,
  onClose,
  user,
}: IUserOptionsModalProps): JSX.Element {
  const {
    id,
    name,
    lastName,
    email,
    identifier,
    telephone,
    initialSemester,
    registration,
    avatar,
    avatarUrl,
    accessLevel,
    isActive,
    createdAt,

    courseName,
    courseNumberPeriods,

    institutionName,
  } = user;

  const {
    isOpen: isOpenConfirmModal,
    onOpen: onOpenConfirmModal,
    onClose: onCloseConfirmModal,
  } = useDisclosure();

  const msgActivateUser =
    "O usuário voltará a ter acesso ao sistema, deseja prosseguir com a alteração?";
  const msgInactivateUser =
    "O usuário perderá o acesso ao sistema, deseja prosseguir com a alteração?";

  const toast = useToast();

  const changeIsActive = useMutation(
    async () => {
      api
        .patch(`users/is-active?userId=${id}`)
        .then(() => {
          toast({
            description: "Status do usuário alterado com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          queryClient.invalidateQueries("users");
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
        <ModalContent mx="2" bg="gray.800">
          <ModalHeader>
            <HStack spacing={6}>
              <Avatar size="md" name={name} src={avatar && avatarUrl} />
              <Text fontSize="xl" fontWeight="normal">
                {`${name} ${lastName}`}
              </Text>
            </HStack>
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody px={["2", "3"]}>
            <Divider mb="4" borderColor="gray.700" />

            <ItemOptionsModal label="CPF" value={identifier} />
            <ItemOptionsModal label="E-mail" value={email} />
            <ItemOptionsModal label="Telefone" value={telephone} />
            <ItemOptionsModal label="Acesso" value={accessLevel} />
            <ItemOptionsModal
              label="Status"
              value={isActive ? "Ativo" : "Inativo"}
            />
            <ItemOptionsModal label="Cadastrado em" value={createdAt} />

            <br />

            <ItemOptionsModal label="Campus" value={institutionName} />
            <ItemOptionsModal label="Matrícula" value={registration} />

            <br />

            <ItemOptionsModal label="Curso" value={courseName} />
            <ItemOptionsModal label="Início" value={initialSemester} />
            <ItemOptionsModal label="Duração" value={courseNumberPeriods} />

            <Divider mt="4" borderColor="gray.700" />
          </ModalBody>

          <ModalFooter px={["2", "3"]} justifyContent="space-between">
            <SimpleGrid flex="1" gap="4" minChildWidth={120} align="flex-start">
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
                    pathname: "/users/edit",
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
            </SimpleGrid>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmModal
        handleConfirm={handleChangeIsActive}
        isOpen={isOpenConfirmModal}
        onClose={onCloseConfirmModal}
        message={isActive ? msgInactivateUser : msgActivateUser}
      ></ConfirmModal>
    </>
  );
}

export { UserOptionsModal };
