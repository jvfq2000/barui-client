import Link from "next/link";
import {
  RiPencilLine,
  RiUserFollowLine,
  RiUserUnfollowLine,
} from "react-icons/ri";
import { useMutation } from "react-query";

import {
  Avatar,
  Button,
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
    accessLevel,
    avatar,
    avatarUrl,
    createdAt,
    identifier,
    isActive,
  } = user;

  const {
    isOpen: isOpenConfirmModal,
    onOpen: onOpenConfirmModal,
    onClose: onCloseConfirmModal,
  } = useDisclosure();

  const msgActivateUser =
    "O usuário poderá acessar o sistema normalmente, deseja prosseguir com a alteração?";
  const msgInactivateUser =
    "O usuário não poderá mais acessar o sistema, deseja prosseguir com a alteração?";

  const toast = useToast();

  const changeIsActive = useMutation(
    async () => {
      api
        .patch(`users/is-active?userId=${id}`)
        .then(() => {
          toast({
            title: "Status alterado",
            description: "Status do usuário alterado com sucesso!",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          queryClient.invalidateQueries("users");
        })
        .catch(error => {
          toast({
            title: "Ops!",
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
        <ModalContent bg="gray.800">
          <ModalHeader mb="6" bg="gray.700">
            <HStack spacing={6}>
              <Avatar size="md" name={name} src={avatar && avatarUrl} />
              <Text fontSize="2xl" fontWeight="bold">
                {`${name} ${lastName}`}
              </Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <SimpleGrid
              flex="1"
              gap="2"
              minChildWidth="200px"
              aling="flex-start"
            >
              <HStack>
                <Text fontSize="lg">CPF:</Text>
                <Text fontSize="lg" color="gray.300">
                  {identifier}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="lg">E-mail:</Text>
                <Text fontSize="lg" color="gray.300">
                  {email}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="lg">Nível de acesso:</Text>
                <Text fontSize="lg" color="gray.300">
                  {accessLevel}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="lg">Data de cadastro:</Text>
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

          <ModalFooter mt="2" justifyContent="space-between">
            <Button
              onClick={() => {
                onClose();
                onOpenConfirmModal();
              }}
              colorScheme={isActive ? "red" : "green"}
              leftIcon={
                <Icon
                  as={isActive ? RiUserUnfollowLine : RiUserFollowLine}
                  fontSize="20"
                />
              }
            >
              {isActive ? "Inativar" : "Ativar"}
            </Button>

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
