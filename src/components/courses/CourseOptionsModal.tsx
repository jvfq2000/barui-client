import Link from "next/link";
import { RiLockLine, RiLockUnlockLine, RiPencilLine } from "react-icons/ri";
import { useMutation } from "react-query";

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
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { api } from "../../services/apiClient";
import { ICourse } from "../../services/hooks/useCourses";
import { queryClient } from "../../services/queryClient";
import { ConfirmModal } from "../ConfirmModal";
import { ItemOptionsModal } from "../ItemOptionsModal";

interface ICourseOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: ICourse;
}

function CourseOptionsModal({
  isOpen,
  onClose,
  course,
}: ICourseOptionsModalProps): JSX.Element {
  const { id, name, numberPeriods, institutionName, isActive, createdAt } =
    course;

  const {
    isOpen: isOpenConfirmModal,
    onOpen: onOpenConfirmModal,
    onClose: onCloseConfirmModal,
  } = useDisclosure();

  const msgActivateCourse =
    "O curso poderá ser utilizado em cadastros ou edições, deseja prosseguir com a alteração?";
  const msgInactivateCourse =
    "O curso não poderá ser utilizado em cadastros ou edições, deseja prosseguir com a alteração?";

  const toast = useToast();

  const changeIsActive = useMutation(
    async () => {
      api
        .patch(`courses/is-active?courseId=${id}`)
        .then(() => {
          toast({
            description: "Status do curso alterado com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          queryClient.invalidateQueries("courses");
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
        <ModalContent mx="2" bg="gray.800">
          <ModalHeader>
            <Text fontSize="2xl" fontWeight="bold">
              {name}
            </Text>
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody px={["2", "3"]} justify="center">
            <Divider mb="4" borderColor="gray.700" />

            <ItemOptionsModal label="Campus" value={institutionName} />
            <ItemOptionsModal
              label="Duração"
              value={`${numberPeriods} semestres`}
            />
            <ItemOptionsModal label="Cadastrado em" value={createdAt} />
            <ItemOptionsModal
              label="Status"
              value={isActive ? "Ativo" : "Inativo"}
            />

            <Divider mt="4" borderColor="gray.700" />
          </ModalBody>

          <ModalFooter px={["2", "3"]} mt="2" justifyContent="space-between">
            <SimpleGrid flex="1" gap="4" minChildWidth={100} align="flex-start">
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
                    pathname: "/courses/edit",
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
        message={isActive ? msgInactivateCourse : msgActivateCourse}
      ></ConfirmModal>
    </>
  );
}

export { CourseOptionsModal };
