export type ICourseCreateData = {
    title: string;
    code: string;
    credits: number;
    preRequisiteCourse: {
        courseId: string;
    }[];
}