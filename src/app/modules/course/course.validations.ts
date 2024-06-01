import { z } from "zod";

const assignOrRemoveFaculty = z.object({
    body: z.object({
        faculties: z.array(z.string(), {
            required_error: "Courses are required"
        })
    })
})

export const CourseValidation = {
    assignOrRemoveFaculty
}