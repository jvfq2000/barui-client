import { useQuery } from "react-query";

import { api } from "../apiClient";

interface IInstitution {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;

  cityId: string;
  cityName: string;

  stateId: string;
  stateName: string;
  stateAcronym: string;
}

interface IGetInstitutionsResponse {
  institutions: IInstitution[];
  totalCount: number;
}

interface IGetInstitutionsRequest {
  page: number;
  filter: string;
  isActive: boolean;
}

async function getInstitutions({
  page,
  filter,
  isActive,
}: IGetInstitutionsRequest): Promise<IGetInstitutionsResponse> {
  console.log(isActive);
  const { data } = await api.get("institutions", {
    params: {
      page,
      registersPerPage: 12,
      filter,
      isActive,
    },
  });

  const { totalCount } = data;

  const institutions = data.institutions.map(institution => {
    return {
      id: institution.id,
      name: institution.name,
      isActive: institution.isActive,
      createdAt: new Date(institution.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),

      cityId: institution.cityId,
      cityName: institution.cityName,

      stateId: institution.stateId,
      stateName: institution.stateName,
      stateAcronym: institution.stateAcronym,
    };
  });

  return { institutions, totalCount };
}

function useInstitutions({ page, filter, isActive }: IGetInstitutionsRequest) {
  return useQuery(
    ["institutions", page, filter, isActive],
    () => getInstitutions({ page, filter, isActive }),
    {
      staleTime: 1000 * 60 * 10,
    },
  );
}

export { useInstitutions, getInstitutions };
export type { IInstitution };
