import { SubmitHandler, useForm } from "react-hook-form";
import {
  RiAddCircleLine,
  RiCloseCircleLine,
  RiDeleteBinLine,
  RiLockLine,
  RiLockUnlockLine,
  RiPencilLine,
} from "react-icons/ri";
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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";

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
  index: number;
  onSave(activities: IActivity[]): void;
}

const persistenceActivityFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  maxHours: yup.string().required("Carga horária máxima obrigatória"),
  minHours: yup.string().required("Carga horária minima obrigatória"),
  categoryId: yup.string().required("Categoria obrigatória"),
});

function PersistenceActivityModal({
  isOpen,
  onClose,
  categories,
  activities,
  index,
  onSave,
}: IChartOptionsModalProps): JSX.Element {
  const { colorMode } = useColorMode();
  const toast = useToast();

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(persistenceActivityFormSchema),
  });

  const { errors } = formState;

  function indexIsValid(index: number): boolean {
    if (!activities || activities.length === 0) {
      return false;
    }

    if (index >= activities.length) {
      return false;
    }

    if (index) {
      return true;
    }

    if (index === 0) {
      return true;
    }

    return false;
  }

  if (indexIsValid(index)) {
    setValue("name", activities[index].name);
    setValue("maxHours", activities[index].maxHours);
    setValue("minHours", activities[index].minHours);
    setValue("categoryId", activities[index].categoryId);
  } else {
    setValue("name", "");
    setValue("maxHours", "");
    setValue("minHours", "");
    setValue("categoryId", "");
  }

  const handleAddActivitie: SubmitHandler<IActivity> = async data => {
    const activity = data;

    activity.categoryName = categories.find(
      category => category.id === data.categoryId,
    ).name;

    if (indexIsValid(index)) {
      const activityAlreadyExists = activities.find(
        (item, i) => item.name === activity.name && i !== index,
      );

      if (activityAlreadyExists) {
        toast({
          description:
            "Já existe outra atividade neste quadro que possui o mesmo nome.",
          status: "error",
          position: "top",
          duration: 8000,
          isClosable: true,
        });
      } else {
        const newActivities = activities;
        activity.id = newActivities[index].id;
        activity.isActive = newActivities[index].isActive;
        activity.createdAt = newActivities[index].createdAt;
        newActivities[index] = activity;

        onSave(newActivities);
        onClose();
      }
    } else {
      const activityAlreadyExists = activities?.find(
        item => item.name === activity.name,
      );

      if (activityAlreadyExists) {
        toast({
          description:
            "Já existe outra atividade neste quadro que possui o mesmo nome.",
          status: "error",
          position: "top",
          duration: 8000,
          isClosable: true,
        });
      } else {
        activity.isActive = true;
        onSave(activities ? [...activities, activity] : [activity]);
        onClose();
      }
    }
  };

  function deleteActivity() {
    const newActivities = activities;
    newActivities.splice(index, 1);

    onSave(newActivities);
    onClose();
  }

  function modfyIsActivate() {
    const newActivities = activities;
    newActivities[index].isActive = !newActivities[index].isActive;

    onSave(newActivities);
    onClose();
  }

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

          <ModalBody px={["2", "3"]}>
            <Divider mb="4" />

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
                  name="categoryId"
                  placeholder="Selecione"
                  options={generateOptionsCategory()}
                  label="Categoria"
                  error={errors.categoryId}
                  {...register("categoryId")}
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  type="number"
                  name="minHours"
                  label="Carga hor. mín."
                  error={errors.minHours}
                  {...register("minHours")}
                />
                <Input
                  type="number"
                  name="maxHours"
                  label="Carga hor. máx."
                  error={errors.maxHours}
                  {...register("maxHours")}
                />
              </SimpleGrid>
            </VStack>

            <Divider mt="4" />
          </ModalBody>

          <ModalFooter px={["2", "3"]} mt="2" justifyContent="space-between">
            <SimpleGrid flex="1" gap="4" minChildWidth={100}>
              <Button
                label="Cancelar"
                onClick={onClose}
                colorScheme={colorMode === "light" ? "grayLight" : "grayDark"}
                leftIcon={<Icon as={RiCloseCircleLine} fontSize="20" />}
              />
              {indexIsValid(index) && !activities[index].id && (
                <Button
                  label="Excluir"
                  onClick={deleteActivity}
                  colorScheme="red"
                  leftIcon={<Icon as={RiDeleteBinLine} fontSize="20" />}
                />
              )}

              {indexIsValid(index) && activities[index].id && (
                <Button
                  label={activities[index].isActive ? "Inativar" : "Ativar"}
                  onClick={modfyIsActivate}
                  colorScheme={activities[index].isActive ? "red" : "teal"}
                  leftIcon={
                    <Icon
                      as={
                        activities[index].isActive
                          ? RiLockLine
                          : RiLockUnlockLine
                      }
                      fontSize="20"
                    />
                  }
                />
              )}
              <Button
                label={indexIsValid(index) ? "Alterar" : "Cadastrar"}
                type="submit"
                colorScheme="green"
                leftIcon={
                  <Icon
                    as={indexIsValid(index) ? RiPencilLine : RiAddCircleLine}
                    fontSize="20"
                  />
                }
              />
            </SimpleGrid>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export { PersistenceActivityModal };
