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
import { IActivityCategory } from "../../services/hooks/useActivityCategories";
import { queryClient } from "../../services/queryClient";
import { ConfirmModal } from "../ConfirmModal";
import { Button } from "../form/Button";
import { ItemOptionsModal } from "../ItemOptionsModal";

interface IActivityCategoryOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityCategory: IActivityCategory;
}

function ActivityCategoryOptionsModal({
  isOpen,
  onClose,
  activityCategory,
}: IActivityCategoryOptionsModalProps): JSX.Element {
  const { id, name, institutionName, isActive, createdAt } = activityCategory;

  const { colorMode } = useColorMode();

  const {
    isOpen: isOpenConfirmModal,
    onOpen: onOpenConfirmModal,
    onClose: onCloseConfirmModal,
  } = useDisclosure();

  const msgActivateActivityCategory =
    "A categoria poderá ser utilizada em cadastros ou edições, deseja prosseguir com a alteração?";
  const msgInactivateActivityCategory =
    "A categoria não poderá ser utilizada em cadastros ou edições, deseja prosseguir com a alteração?";

  const toast = useToast();

  const changeIsActive = useMutation(
    async () => {
      api
        .patch(`activity-categories/is-active?activityCategoryId=${id}`)
        .then(() => {
          toast({
            description: "Status da categoria alterado com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          queryClient.invalidateQueries("activityCategories");
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
              {name}
            </Text>
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody px={["2", "3"]} justify="center">
            <Divider
              mb="4"
              borderColor={
                colorMode === "dark" ? "grayDark.700" : "grayLight.700"
              }
            />

            <ItemOptionsModal label="Campus" value={institutionName} />
            <ItemOptionsModal label="Cadastrado em" value={createdAt} />
            <ItemOptionsModal
              label="Status"
              value={isActive ? "Ativo" : "Inativo"}
            />

            <Divider
              mt="4"
              borderColor={
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
                    pathname: "/activity-categories/edit",
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
          isActive ? msgInactivateActivityCategory : msgActivateActivityCategory
        }
      ></ConfirmModal>
    </>
  );
}

export { ActivityCategoryOptionsModal };
