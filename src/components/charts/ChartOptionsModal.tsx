import Link from "next/link";
import {
  RiEyeLine,
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
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { api } from "../../services/apiClient";
import { IChart } from "../../services/hooks/useCharts";
import { queryClient } from "../../services/queryClient";
import { accessLevel } from "../../utils/permitions";
import { Can } from "../Can";
import { ConfirmModal } from "../ConfirmModal";
import { Button } from "../form/Button";
import { ItemOptionsModal } from "../ItemOptionsModal";

interface IChartOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  chart: IChart;
}

function ChartOptionsModal({
  isOpen,
  onClose,
  chart,
}: IChartOptionsModalProps): JSX.Element {
  const { id, name, inForceFrom, minHours, courseName, isActive, createdAt } =
    chart;

  const { colorMode } = useColorMode();

  const {
    isOpen: isOpenConfirmModal,
    onOpen: onOpenConfirmModal,
    onClose: onCloseConfirmModal,
  } = useDisclosure();

  const msgActivateChart =
    "O quadro poderá ser acessado pelos alunos, deseja prosseguir com a alteração?";
  const msgInactivateChart =
    "O quadro não poderá ser acessado pelos alunos, deseja prosseguir com a alteração?";

  const toast = useToast();

  const changeIsActive = useMutation(
    async () => {
      api
        .patch(`charts/is-active?chartId=${id}`)
        .then(() => {
          toast({
            description: "Status do quadro alterado com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          queryClient.invalidateQueries("charts");
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

            <ItemOptionsModal label="Curso" value={courseName} />
            <ItemOptionsModal
              label="Em vigor a partir de"
              value={inForceFrom}
            />
            <ItemOptionsModal label="Qtd. mín. horas" value={minHours} />
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
                <Can accessLevel={accessLevel[3]}>
                  <Link
                    href={{
                      pathname: "/charts/edit",
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

                  <Link
                    href={{
                      pathname: "/charts/view",
                      query: { id },
                    }}
                  >
                    <Button
                      label="Visualizar"
                      onClick={onClose}
                      colorScheme="green"
                      leftIcon={<Icon as={RiEyeLine} fontSize="20" />}
                    />
                  </Link>
                </Can>
              )}
            </SimpleGrid>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmModal
        handleConfirm={handleChangeIsActive}
        isOpen={isOpenConfirmModal}
        onClose={onCloseConfirmModal}
        message={isActive ? msgInactivateChart : msgActivateChart}
      ></ConfirmModal>
    </>
  );
}

export { ChartOptionsModal };
