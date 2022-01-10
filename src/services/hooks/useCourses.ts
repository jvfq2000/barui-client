import { useQuery } from "react-query";

import { api } from "../apiClient";

interface ICourse {
  id: string;
  name: string;
  numberPeriods: number;
  isActive: boolean;
  createdAt: Date;

  institutionId: string;
  institutionName: string;
}

interface IGetCoursesResponse {
  courses: ICourse[];
  totalCount: number;
}

interface IGetCoursesRequest {
  page: number;
  filter: string;
  isActive: boolean;
}

async function getCourses({
  page,
  filter,
  isActive,
}: IGetCoursesRequest): Promise<IGetCoursesResponse> {
  const { data } = await api.get("courses", {
    params: {
      page,
      registersPerPage: 12,
      filter,
      isActive,
    },
  });

  const { totalCount } = data;

  const courses = data.courses.map(course => {
    return {
      id: course.id,
      name: course.name,
      numberPeriods: course.numberPeriods,
      isActive: course.isActive,
      createdAt: new Date(course.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),

      institutionId: course.institutionId,
      institutionName: course.institutionName,
    };
  });

  return { courses, totalCount };
}

function useCourses({ page, filter, isActive }: IGetCoursesRequest) {
  return useQuery(
    ["courses", page, filter, isActive],
    () => getCourses({ page, filter, isActive }),
    {
      staleTime: 1000 * 60 * 10,
    },
  );
}

export { useCourses, getCourses };
export type { ICourse };
