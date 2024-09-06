import { Request, Response } from 'express';
import { RegisterStudent } from '../../application/useCases/RegisterStudent';
import { MongoStudentRepository } from '../../infrastructure/repositories/MongoStudentRepository';

const studentRepo = new MongoStudentRepository();
const registerStudent = new RegisterStudent(studentRepo);

export const StudentController = {
    register: async (req: Request, res: Response) => {
        const { name, email, mobile, password } = req.body;
        
        try {
            await registerStudent.execute(name, email, mobile, password);
            res.status(201).send({ message: 'Student registered successfully!' });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send({ error: error.message });
            } else {
                res.status(400).send({ error: 'An unknown error occurred' });
            }
        }
    }
};