import express from 'express';
import { CourseController } from './course.controller';

const router = express.Router();

router.post('/', CourseController.createCourse);
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);
router.patch('/:id', CourseController.updateCourseById);
router.delete('/:id', CourseController.deleteCourse);

export const CourseRoutes = router;
