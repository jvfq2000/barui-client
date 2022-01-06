import { useQuery } from "react-query";

import { api } from "../apiClient";

interface IState {
  id: string;
  name: string;
  acronym: string;
  createdAt: string;
}

interface ICity {
  id: string;
  name: string;
  stateId: string;
  state: IState;
  createdAt: string;
}

interface IInstitution {
  id: string;
  name: string;
  cityId: string;
  city: ICity;
  isActive: boolean;
  createdAt: string;
}

interface IGetInstitutionsResponse {
  institutions: IInstitution[];
  totalCount: number;
}

interface IGetInstitutionsRequest {
  page: number;
  filter: string;
}

async function getInstitutions({
  page,
  filter,
}: IGetInstitutionsRequest): Promise<IGetInstitutionsResponse> {
  const { data } = await api.get("institutions", {
    params: {
      page,
      registersPerPage: 12,
      filter,
    },
  });

  const { totalCount } = data;

  const institutions = data.institutions.map(institution => {
    return {
      id: institution.id,
      name: institution.name,
      cityId: institution.cityId,
      city: institution.city,
      isActive: institution.isActive,
      createdAt: new Date(institution.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };
  });

  return { institutions, totalCount };
}

function useInstitutions({ page, filter }: IGetInstitutionsRequest) {
  return useQuery(
    ["institutions", page, filter],
    () => getInstitutions({ page, filter }),
    {
      staleTime: 1000 * 60 * 10,
    },
  );
}

export { useInstitutions, getInstitutions };
export type { IInstitution };
