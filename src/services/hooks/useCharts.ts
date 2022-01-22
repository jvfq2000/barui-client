import { useQuery } from "react-query";

import { api } from "../apiClient";

interface IActivity {
  id?: string;
  name: string;
  maxHours: number;
  minHours: number;
  isActive?: boolean;
  createdAt?: Date;

  chartId: string;
  chartName: string;

  categoryId: string;
  categoryName: string;
}

interface IChart {
  id: string;
  name: string;
  inForceFrom: string;
  isActive: boolean;
  createdAt: Date;

  courseId: string;
  courseName: string;

  activities: IActivity[];
}

interface IGetChartsResponse {
  charts: IChart[];
  totalCount: number;
}

interface IGetChartsRequest {
  page: number;
  filter: string;
  isActive: boolean;
}

async function getCharts({
  page,
  filter,
  isActive,
}: IGetChartsRequest): Promise<IGetChartsResponse> {
  const { data } = await api.get("charts", {
    params: {
      page,
      registersPerPage: 12,
      filter,
      isActive,
    },
  });

  const { totalCount } = data;

  const charts = data.charts.map(chart => {
    return {
      id: chart.id,
      name: chart.name,
      inForceFrom: chart.inForceFrom,
      isActive: chart.isActive,
      createdAt: new Date(chart.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),

      courseId: chart.courseId,
      courseName: chart.courseName,

      activities: chart.activities.map(activity => {
        return {
          id: activity.id,
          name: activity.name,
          maxHours: activity.maxHours,
          minHours: activity.minHours,
          isActive: activity.isActive,
          createdAt: new Date(activity.createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),

          chartId: activity.chartId,
          chartName: activity.chartName,

          categoryId: activity.categoryId,
          categoryName: activity.categoryName,
        };
      }),
    };
  });

  return { charts, totalCount };
}

function useCharts({ page, filter, isActive }: IGetChartsRequest) {
  return useQuery(
    ["charts", page, filter, isActive],
    () => getCharts({ page, filter, isActive }),
    {
      staleTime: 1000 * 60 * 10,
    },
  );
}

export { useCharts, getCharts };
export type { IChart, IActivity };
