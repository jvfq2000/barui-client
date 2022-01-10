import { useQuery } from "react-query";

import { api } from "../apiClient";

interface IUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  identifier: string;
  telephone: string;
  initialSemester: string;
  registration: string;
  avatar: string;
  avatarUrl: string;
  accessLevel: string;
  isActive: boolean;
  createdAt: Date;

  courseId: string;
  courseName: string;
  courseNumberPeriods: number;

  institutionId: string;
  institutionName: string;
}

interface IGetUsersResponse {
  users: IUser[];
  totalCount: number;
}

interface IGetUsersRequest {
  page: number;
  filter: string;
  isActive: boolean;
}

async function getUsers({
  page,
  filter,
  isActive,
}: IGetUsersRequest): Promise<IGetUsersResponse> {
  const { data } = await api.get("users", {
    params: {
      page,
      registersPerPage: 12,
      filter,
      isActive,
    },
  });

  const { totalCount } = data;

  const users = data.users.map(user => {
    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      identifier: user.identifier,
      telephone: user.telephone,
      initialSemester: user.initialSemester,
      registration: user.registration,
      avatar: user.avatar,
      avatarUrl: user.avatarUrl,
      accessLevel: user.accessLevel,
      isActive: user.isActive,
      createdAt: new Date(user.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),

      courseId: user.courseId,
      courseName: user.courseName,
      courseNumberPeriods: user.courseNumberPeriods,

      institutionId: user.institutionId,
      institutionName: user.institutionName,
    };
  });

  return { users, totalCount };
}

function useUsers({ page, filter, isActive }: IGetUsersRequest) {
  return useQuery(
    ["users", page, filter, isActive],
    () => getUsers({ page, filter, isActive }),
    {
      staleTime: 1000 * 60 * 10,
    },
  );
}

export { useUsers, getUsers };
export type { IUser };
