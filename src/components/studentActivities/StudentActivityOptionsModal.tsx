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
  Link as LinkChakra,
} from "@chakra-ui/react";

import { api } from "../../services/apiClient";
import { IStudentActivity } from "../../services/hooks/useStudentActivities";
import { queryClient } from "../../services/queryClient";
import { ConfirmModal } from "../ConfirmModal";
import { Button } from "../form/Button";
import { ItemOptionsModal } from "../ItemOptionsModal";

interface IStudentActivityOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  studentActivity: IStudentActivity;
}

function StudentActivityOptionsModal({
  isOpen,
  onClose,
  userId,
  studentActivity,
}: IStudentActivityOptionsModalProps): JSX.Element {
  const {
    id,
    description,
    hours,
    semester,
    isCertified,
    justification,
    approvedHours,
    fileUrl,
    userId: activityUserId,
    userName,
    categoryName,
    activityName,
    isActive,
    createdAt,
  } = studentActivity;

  const { colorMode } = useColorMode();

  const {
    isOpen: isOpenConfirmModal,
    onOpen: onOpenConfirmModal,
    onClose: onCloseConfirmModal,
  } = useDisclosure();

  const msgActivateStudentActivity =
    "A atividade voltará a ser contabilizada nas contagens de horas, deseja prosseguir com a alteração?";
  const msgInactivateStudentActivity =
    "A atividade deixará de ser contabilizada nas contagens de horas, deseja prosseguir com a alteração?";

  const toast = useToast();

  const changeIsActive = useMutation(
    async () => {
      api
        .patch(`student-activities/is-active?studentActivityId=${id}`)
        .then(() => {
          toast({
            description: "Status da atividade alterado com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          queryClient.invalidateQueries("studentActivities");
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
          <ModalHeader>
            <Text fontSize="2xl" fontWeight="bold">
              {description}
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

            {!!userId && <ItemOptionsModal label="Aluno" value={userName} />}
            <ItemOptionsModal label="Semestre" value={semester} />
            <ItemOptionsModal
              label="Comprovado"
              value={isCertified ? "Sim" : "Não"}
            />
            {isCertified && (
              <LinkChakra href={fileUrl} isExternal>
                <Text fontSize="lg" fontWeight="bold" color="green.500">
                  Baixar comprovação
                </Text>
              </LinkChakra>
            )}
            {!isCertified && (
              <ItemOptionsModal label="Justificativa" value={justification} />
            )}
            <ItemOptionsModal label="Qtd. horas" value={hours} />
            <ItemOptionsModal
              label="Qtd. horas aprovadas"
              value={approvedHours}
            />
            <ItemOptionsModal label="Categoria" value={categoryName} />
            <ItemOptionsModal label="Atividade" value={activityName} />
            <ItemOptionsModal label="Cadastrado em" value={createdAt} />
            <ItemOptionsModal
              label="Status"
              value={isActive ? "Ativo" : "Inativo"}
            />
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
                    pathname: "/student-activities/edit",
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
        message={
          isActive ? msgInactivateStudentActivity : msgActivateStudentActivity
        }
      ></ConfirmModal>
    </>
  );
}

export { StudentActivityOptionsModal };
