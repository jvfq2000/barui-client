import { useQuery } from "react-query";

import { api } from "../apiClient";

interface IUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  identifier: string;
  accessLevel: string;
  avatar: string;
  avatarUrl: string;
  createdAt: string;
  isActive: boolean;
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
      accessLevel: user.accessLevel,
      avatar: user.avatar,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      identifier: user.identifier,
      createdAt: new Date(user.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };
  });

  return { users, totalCount };
}

function useUsers({ page, filter, isActive }: IGetUsersRequest) {
  return useQuery(
    ["users", page, filter],
    () => getUsers({ page, filter, isActive }),
    {
      staleTime: 1000 * 60 * 10,
    },
  );
}

export { useUsers, getUsers };
export type { IUser };
