import { useQuery } from "react-query";

import { api } from "../apiClient";

interface IRegulation {
  id: string;
  name: string;
  file: string;
  fileUrl: string;
  inForceFrom: string;
  isActive: boolean;
  createdAt: Date;

  courseId: string;
  courseName: string;
}

interface IGetRegulationsResponse {
  regulations: IRegulation[];
  totalCount: number;
}

interface IGetRegulationsRequest {
  page: number;
  filter: string;
  isActive: boolean;
}

async function getRegulations({
  page,
  filter,
  isActive,
}: IGetRegulationsRequest): Promise<IGetRegulationsResponse> {
  const { data } = await api.get("regulations", {
    params: {
      page,
      registersPerPage: 12,
      filter,
      isActive,
    },
  });

  const { totalCount } = data;

  const regulations = data.regulations.map(regulation => {
    return {
      id: regulation.id,
      name: regulation.name,
      inForceFrom: regulation.inForceFrom,
      file: regulation.file,
      fileUrl: regulation.fileUrl,
      isActive: regulation.isActive,
      createdAt: new Date(regulation.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),

      courseId: regulation.courseId,
      courseName: regulation.courseName,
    };
  });

  return { regulations, totalCount };
}

function useRegulations({ page, filter, isActive }: IGetRegulationsRequest) {
  return useQuery(
    ["regulations", page, filter, isActive],
    () => getRegulations({ page, filter, isActive }),
    {
      staleTime: 1000 * 60 * 10,
    },
  );
}

export { useRegulations, getRegulations };
export type { IRegulation };
