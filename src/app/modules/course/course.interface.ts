export type ICourseCreateData = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourse: IPrerequisiteCourseRequest[];
};

export type ICourseFilterRequest = {
  searchTerm?: string;
};

export type IPrerequisiteCourseRequest = {
  courseId: string;
  isDeleted?: null;
};
