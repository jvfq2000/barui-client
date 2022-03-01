import { useEffect, useState } from "react";
import { RiArrowGoBackLine } from "react-icons/ri";

import {
  Box,
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
  useToast,
} from "@chakra-ui/react";

import { api } from "../../services/apiClient";
import { Button } from "../form/Button";
import { ItemCard } from "../ItemCard";

interface IHistoricStudentActivity {
  id: string;
  action: string;
  field: string;
  before: string;
  later: string;
  createdAt: Date;

  userId: string;
  userName: string;

  studentActivityId: string;
  studentActivityDescription: string;
}

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentActivityId: string;
}

function HistoricStudentActivityModal({
  isOpen,
  onClose,
  studentActivityId,
}: IModalProps): JSX.Element {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [historical, setHistorical] = useState<IHistoricStudentActivity[]>();

  useEffect(() => {
    if (studentActivityId) {
      api
        .get(
          `student-activities/historic?studentActivityId=${studentActivityId}`,
        )
        .then(response => {
          setHistorical(response.data);
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
    }
  }, [studentActivityId]);

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent
        mx="2"
        bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
      >
        {historical?.length && (
          <>
            <ModalHeader>
              <Text fontSize="xl" fontWeight="bold">
                {historical[0].studentActivityDescription}
              </Text>
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody px={["2", "6"]}>
              <Divider mb="4" />

              {historical.map(historic => {
                return (
                  <Box
                    h="100%"
                    p={["1", "2"]}
                    bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
                    border="1px solid #616480"
                    borderRadius={8}
                    pb="4"
                    mb="2"
                  >
                    <Text align="center" fontSize="md">
                      {historic.action}
                    </Text>

                    <ItemCard label="Usuário" value={historic.userName} />
                    <ItemCard
                      label="Realizado em"
                      value={new Date(historic.createdAt).toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        },
                      )}
                    />

                    {historic.action === "Alteração" && (
                      <>
                        <ItemCard
                          label="Campo alterado"
                          value={historic.field}
                        />
                        <ItemCard label="Antes" value={historic.before} />
                        <ItemCard label="Depois" value={historic.later} />
                      </>
                    )}
                  </Box>
                );
              })}

              <Divider mt="4" />
            </ModalBody>

            <ModalFooter px={["2", "6"]} mt="2" justifyContent="space-between">
              <SimpleGrid flex="1" gap="4" minChildWidth={100}>
                <Button
                  label="Voltar"
                  colorScheme={colorMode === "light" ? "grayLight" : "grayDark"}
                  onClick={onClose}
                  leftIcon={<Icon as={RiArrowGoBackLine} fontSize="20" />}
                />
              </SimpleGrid>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export { HistoricStudentActivityModal };
