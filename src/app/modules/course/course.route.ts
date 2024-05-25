import express from 'express';
import { CourseController } from './course.controller';

const router = express.Router();

router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);
router.post('/', CourseController.createCourse);
router.post('/:id/assign-faculties', CourseController.assignFaculties);
router.patch('/:id', CourseController.updateCourseById);
router.delete('/:id', CourseController.deleteCourse);
router.delete('/:id/remove-faculties', CourseController.removeFaculty);

export const CourseRoutes = router;
 