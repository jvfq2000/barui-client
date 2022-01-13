import Link from "next/link";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";

import {
  Box,
  Flex,
  Heading,
  Button,
  Divider,
  VStack,
  SimpleGrid,
  HStack,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import { Input } from "../../components/form/Input";
import { InputMask } from "../../components/form/InputMask";
import { ISelectOption, Select } from "../../components/form/Select";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

interface IEditUserFormData {
  name: string;
  lastName: string;
  email: string;
  identifier: string;
  telephone: string;
  initialSemester: string;
  registration: string;
  accessLevel: string;
  courseId: string;
  institutionId: string;
}

interface IState {
  id: string;
  name: string;
  acronym: string;
}

interface ICity {
  id: string;
  name: string;
}

interface IInstitution {
  id: string;
  name: string;
}

export default function EditUser(): JSX.Element {
  const { id } = Router.query;
  const { user } = useContext(AuthContext);
  const toast = useToast();

  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");

  const [cities, setCities] = useState<ICity[]>();
  const [states, setStates] = useState<IState[]>();
  const [institutions, setInstitutions] = useState<IInstitution[]>();
  const [courses, setCourses] = useState<IState[]>();
  const [accessLevelForm, setAccessLevelForm] = useState("aluno");

  const editUserFormSchema = yup.object().shape({
    name: yup.string().required("Nome obrigatório"),
    lastName: yup.string().required("Sobrenome obrigatório"),
    email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
    identifier: yup
      .string()
      .required("CPF obrigatório")
      .min(14, "CPF incompleto"),
    telephone: yup.string(),
    accessLevel: yup.string().required("Nível de acesso obrigatório"),
    institutionId: yup
      .string()
      .test("institutionIdTest", "Campus obrigatório", value => {
        if (user.accessLevel !== accessLevel[4]) {
          return true;
        }
        return !!value;
      }),
    initialSemester: yup
      .string()
      .test("initialSemesterTest", "Primeiro semestre obrigatório", value => {
        if (accessLevel[accessLevelForm] > accessLevel.aluno) {
          return true;
        }
        return !!value;
      }),
    registration: yup
      .string()
      .test("registrationTest", "Matrícula obrigatório", value => {
        if (accessLevel[accessLevelForm] > accessLevel.aluno) {
          return true;
        }
        return !!value;
      }),
    courseId: yup.string().test("courseIdTest", "Curso obrigatório", value => {
      if (user.accessLevel === accessLevel[4]) {
        return true;
      }
      return !!value;
    }),
  });

  useEffect(() => {
    api
      .get(`states`)
      .then(response => {
        const states = response.data;
        setStates(states);
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
  }, []);

  const editUser = useMutation(
    async (user: IEditUserFormData) => {
      api
        .put(`users?userId=${id}`, user)
        .then(response => {
          toast({
            description: "Usuário alterado com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          Router.push("/users");
          return response.data.user;
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
        queryClient.invalidateQueries("users");
      },
    },
  );

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(editUserFormSchema),
  });
  const { errors } = formState;

  function generateAccessLevelOptions(): ISelectOption[] {
    let options: ISelectOption[];

    if (user?.accessLevel === accessLevel[3]) {
      options = [
        {
          value: accessLevel[0],
          label: "Aluno",
        },
        { value: accessLevel[1], label: "Coordenador de atividades" },
        { value: accessLevel[2], label: "Coordenador de curso" },
      ];
    } else {
      options = [
        { value: accessLevel[3], label: "Administrador do campus" },
        { value: accessLevel[4], label: "Administrador geral" },
      ];
    }

    return options;
  }

  const { data, isLoading } = useQuery(
    ["cities", stateId],
    async (): Promise<ICity[]> => {
      const { data } = stateId
        ? await api.get(`cities?stateId=${stateId}`)
        : { data: [] };

      return data;
    },
    {
      staleTime: 1000 * 60 * 60,
    },
  );

  useEffect(() => {
    setCities(data);
  }, [data]);

  if (user.accessLevel === accessLevel[4]) {
    useEffect(() => {
      if (cityId) {
        api
          .get(`institutions/by-city-id?cityId=${cityId}`)
          .then(response => {
            const institutions = response.data;
            setInstitutions(institutions);
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
      }
    }, [cityId]);
  }

  if (user.accessLevel === accessLevel[3]) {
    useEffect(() => {
      api
        .get(`courses/by-institution-id`)
        .then(response => {
          const courses = response.data;
          setCourses(courses);
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
    }, []);
  }

  function generateOptionsStates(): ISelectOption[] {
    const options: ISelectOption[] = [];

    states?.forEach(state => {
      options.push({
        value: state.id,
        label: `${state.name} - ${state.acronym}`,
      });
    });

    return options;
  }

  function generateOptionsCities(): ISelectOption[] {
    const options: ISelectOption[] = [];

    cities?.forEach(citie => {
      options.push({
        value: citie.id,
        label: citie.name,
      });
    });

    return options;
  }

  function generateOptionsInstitutions(): ISelectOption[] {
    const options: ISelectOption[] = [];

    institutions?.forEach(institution => {
      options.push({
        value: institution.id,
        label: institution.name,
      });
    });

    return options;
  }

  function generateOptionsCourses(): ISelectOption[] {
    const options: ISelectOption[] = [];

    courses?.forEach(course => {
      options.push({
        value: course.id,
        label: course.name,
      });
    });

    return options;
  }

  useEffect(() => {
    api
      .get(`users/by-id?userId=${id}`)
      .then(response => {
        const {
          name,
          lastName,
          email,
          identifier,
          telephone,
          initialSemester,
          registration,
          accessLevel: accessLevelResponse,

          stateId,
          cityId,
          institutionId,
          courseId,
        } = response.data;

        setValue("name", name);
        setValue("lastName", lastName);
        setValue("email", email);
        setValue("identifier", identifier);
        setValue("telephone", telephone);
        setValue("accessLevel", accessLevelResponse);

        setAccessLevelForm(accessLevelResponse);

        if (
          accessLevel[String(accessLevelResponse)] <
          accessLevel["administrador do campus"]
        ) {
          setValue("courseId", courseId);
        }

        if (accessLevel[String(accessLevelResponse)] === accessLevel.aluno) {
          setValue("initialSemester", initialSemester);
          setValue("registration", registration);
        }

        if (
          accessLevel[String(accessLevelResponse)] >=
          accessLevel["administrador do campus"]
        ) {
          setStateId(stateId);
          setCityId(cityId);
          setValue("institutionId", institutionId);
        }
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
  }, [institutions]);

  const handleEditUser: SubmitHandler<IEditUserFormData> = async data => {
    await editUser.mutateAsync(data);
  };

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px={[4, 6]}>
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
          onSubmit={handleSubmit(handleEditUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Cadastar usuário
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Select
                name="accessLevel"
                placeholder="Selecione"
                options={generateAccessLevelOptions()}
                label="Nível de acesso"
                error={errors.accessLevel}
                {...register("accessLevel")}
                onChange={event => {
                  setAccessLevelForm(event.target.value);
                }}
              />
              <Input
                name="name"
                label="Nome"
                error={errors.name}
                {...register("name")}
              />
              <Input
                name="lastName"
                label="Sobrenome"
                error={errors.lastName}
                {...register("lastName")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <InputMask
                mask="***.***.***-**"
                placeholder="999.999.999-99"
                maskChar="_"
                name="identifier"
                label="CPF"
                error={errors.identifier}
                {...register("identifier")}
              />
              <Input
                name="email"
                type="email"
                label="E-mail"
                error={errors.email}
                {...register("email")}
              />
              <InputMask
                mask="(**) * **** - ****"
                placeholder="(38) 9 9999 - 9999"
                maskChar="_"
                name="telephone"
                label="Telefone"
                error={errors.telephone}
                {...register("telephone")}
              />
            </SimpleGrid>

            {accessLevel[accessLevelForm] >=
              accessLevel["administrador do campus"] && (
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Select
                  name="states"
                  placeholder="Selecione"
                  options={generateOptionsStates()}
                  label="Estado"
                  value={stateId}
                  onChange={event => {
                    setStateId(event.target.value);
                  }}
                />
                <Select
                  name="cities"
                  placeholder={isLoading ? "Buscando cidades ..." : "Selecione"}
                  options={generateOptionsCities()}
                  label="Cidade"
                  value={cityId}
                  onChange={event => {
                    setCityId(event.target.value);
                  }}
                  isDisabled={isLoading}
                />
                <Select
                  name="institutions"
                  placeholder={isLoading ? "Buscando campus ..." : "Selecione"}
                  options={generateOptionsInstitutions()}
                  label="Campus"
                  error={errors.institutionId}
                  {...register("institutionId")}
                  isDisabled={isLoading}
                />
              </SimpleGrid>
            )}

            {accessLevel[accessLevelForm] <
              accessLevel["administrador do campus"] && (
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Select
                  name="course"
                  placeholder="Selecione"
                  options={generateOptionsCourses()}
                  label="Curso"
                  error={errors.courseId}
                  {...register("courseId")}
                />
              </SimpleGrid>
            )}

            {accessLevel[accessLevelForm] === accessLevel.aluno && (
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  name="registration"
                  label="Matrícula"
                  error={errors.registration}
                  {...register("registration")}
                />
                <InputMask
                  mask="**/****"
                  placeholder="01/2022"
                  maskChar="_"
                  name="initialSemester"
                  label="Primeiro semestre"
                  error={errors.initialSemester}
                  {...register("initialSemester")}
                />
              </SimpleGrid>
            )}
          </VStack>
          <Divider my="6" borderColor="gray.700" />
          <Flex>
            <HStack w="100%" justify="space-between">
              <Link href="/users" passHref>
                <Button
                  colorScheme="whiteAlpha"
                  leftIcon={<Icon as={RiCloseCircleLine} fontSize="20" />}
                >
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                colorScheme="green"
                isLoading={formState.isSubmitting}
                leftIcon={<Icon as={RiCheckboxCircleLine} fontSize="20" />}
              >
                Alterar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: {},
  };
}, accessLevel[3]);

export { getServerSideProps };
