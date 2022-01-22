import { SubmitHandler, useForm } from "react-hook-form";
import { RiCloseCircleLine, RiPencilLine } from "react-icons/ri";
import * as yup from "yup";

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
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import { IActivity } from "../../services/hooks/useCharts";
import { Button } from "../form/Button";
import { Input } from "../form/Input";
import { ISelectOption, Select } from "../form/Select";

interface ICategory {
  id: string;
  name: string;
}

interface IChartOptionsModalProps {
  isOpen: boolean;
  onClose(): void;
  categories: ICategory[];
  activities: IActivity[];
  onSubmit(activities: IActivity[]): void;
}

const persistenceActivityFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  maxHours: yup.number().required("Carga horária máxima obrigatória"),
  minHours: yup.number().required("Carga horária minima obrigatória"),
  categoryId: yup.string().required("Categoria obrigatória"),
});

function PersistenceActivityModal({
  isOpen,
  onClose,
  categories,
  activities,
  onSubmit,
}: IChartOptionsModalProps): JSX.Element {
  const { colorMode } = useColorMode();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(persistenceActivityFormSchema),
  });

  const { errors } = formState;

  const handleAddActivitie: SubmitHandler<IActivity> = async data => {
    activities.push(data);
    onSubmit(activities);
  };

  function generateOptionsCategory(): ISelectOption[] {
    const options: ISelectOption[] = [];

    categories?.forEach(course => {
      options.push({
        value: course.id,
        label: course.name,
      });
    });

    return options;
  }

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={handleSubmit(handleAddActivitie)}
          mx="2"
          bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
        >
          <ModalHeader>
            <Text fontSize="2xl" fontWeight="bold">
              Adicionar atividade
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

            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="name"
                  label="Nome"
                  error={errors.name}
                  {...register("name")}
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Select
                  name="catogoryId"
                  placeholder="Selecione"
                  options={generateOptionsCategory()}
                  label="Categoria"
                  error={errors.catogoryId}
                  {...register("catogoryId")}
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  type="number"
                  name="maxHours"
                  label="Carga hor. máx."
                  error={errors.maxHours}
                  {...register("maxHours")}
                />
                <Input
                  type="number"
                  name="minHours"
                  label="Carga hor. mín."
                  error={errors.minHours}
                  {...register("minHours")}
                />
              </SimpleGrid>
            </VStack>

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
                label="Cancelar"
                onClick={() => {
                  onClose();
                }}
                colorScheme={colorMode === "dark" ? "grayLight" : "grayDark"}
                leftIcon={<Icon as={RiCloseCircleLine} fontSize="20" />}
              />
              <Button
                label="Adicionar"
                onClick={onClose}
                colorScheme="green"
                leftIcon={<Icon as={RiPencilLine} fontSize="20" />}
              />
            </SimpleGrid>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export { PersistenceActivityModal };
