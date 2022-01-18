import { useQuery } from "react-query";

import { api } from "../apiClient";

interface IActivityCategory {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;

  institutionId: string;
  institutionName: string;
}

interface IGetActivityCategoriesResponse {
  activityCategories: IActivityCategory[];
  totalCount: number;
}

interface IGetActivityCategoriesRequest {
  page: number;
  filter: string;
  isActive: boolean;
}

async function getActivityCategories({
  page,
  filter,
  isActive,
}: IGetActivityCategoriesRequest): Promise<IGetActivityCategoriesResponse> {
  const { data } = await api.get("activity-categories", {
    params: {
      page,
      registersPerPage: 12,
      filter,
      isActive,
    },
  });

  const { totalCount } = data;

  const activityCategories = data.activityCategories.map(activityCategory => {
    return {
      id: activityCategory.id,
      name: activityCategory.name,
      isActive: activityCategory.isActive,
      createdAt: new Date(activityCategory.createdAt).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        },
      ),

      institutionId: activityCategory.institutionId,
      institutionName: activityCategory.institutionName,
    };
  });

  return { activityCategories, totalCount };
}

function useActivityCategories({
  page,
  filter,
  isActive,
}: IGetActivityCategoriesRequest) {
  return useQuery(
    ["activityCategories", page, filter, isActive],
    () => getActivityCategories({ page, filter, isActive }),
    {
      staleTime: 1000 * 60 * 10,
    },
  );
}

export { useActivityCategories, getActivityCategories };
export type { IActivityCategory };
