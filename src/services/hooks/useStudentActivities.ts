import { useQuery } from "react-query";

import { api } from "../apiClient";

interface IStudentActivity {
  id: string;
  description: string;
  hours: number;
  semester: string;
  isCertified: boolean;
  justification: string;
  approvedHours: number;
  file: string;
  fileUrl: string;
  isActive: boolean;
  createdAt: Date;

  userId: string;
  userName: string;

  categoryId: string;
  categoryName: string;

  activityId: string;
  activityName: string;
}

interface IGetStudentActivitiesResponse {
  studentActivities: IStudentActivity[];
  totalCount: number;
}

interface IGetStudentActivitiesRequest {
  page: number;
  filter: string;
  isActive: boolean;
  userId?: string;
}

async function getStudentActivities({
  page,
  filter,
  isActive,
  userId,
}: IGetStudentActivitiesRequest): Promise<IGetStudentActivitiesResponse> {
  const { data } = await api.get("student-activities", {
    params: {
      page,
      registersPerPage: 12,
      filter,
      isActive,
      userId,
    },
  });

  const { totalCount } = data;

  const studentActivities = data.StudentActivities.map(studentActivity => {
    return {
      id: studentActivity.id,
      description: studentActivity.description,
      hours: studentActivity.hours,
      semester: studentActivity.semester,
      isCertified: studentActivity.isCertified,
      justification: studentActivity.justification,
      approvedHours: studentActivity.approvedHours,
      file: studentActivity.file,
      fileUrl: studentActivity.fileUrl,
      isActive: studentActivity.isActive,
      createdAt: new Date(studentActivity.createdAt).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        },
      ),

      userId: studentActivity.userId,
      userName: studentActivity.userName,

      categoryId: studentActivity.categoryId,
      categoryName: studentActivity.categoryName,

      activityId: studentActivity.activityId,
      activityName: studentActivity.activityName,
    };
  });

  return { studentActivities, totalCount };
}

function useStudentActivities({
  page,
  filter,
  isActive,
  userId,
}: IGetStudentActivitiesRequest) {
  return useQuery(
    ["studentActivities", page, filter, isActive, userId],
    () => getStudentActivities({ page, filter, isActive, userId }),
    {
      staleTime: 1000 * 60 * 10,
    },
  );
}

export { useStudentActivities, getStudentActivities };
export type { IStudentActivity };
