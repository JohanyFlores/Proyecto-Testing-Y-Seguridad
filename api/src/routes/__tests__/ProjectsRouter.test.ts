
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';
import ProjectsRouter from '../ProjectsRouter';
import ProjectModel from '../../components/Projects/model';
import { buildProject, resetProjectFactory } from '../../tests/factories/projectFactory';

// Mock de la autenticación para no depender de ella en los tests
jest.mock('@/config/middleware/jwtAuth', () => ({
    isAuthenticated: (req: Request, res: Response, next: NextFunction) => next()
}));

describe('ProjectsRouter', () => {
    let mongod: MongoMemoryServer;
    const app = express();
    app.use(express.json());
    app.use('/v1/projects', ProjectsRouter);

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongod.stop();
    });

    beforeEach(async () => {
        await ProjectModel.deleteMany({});
        resetProjectFactory();
    });

    describe('GET /v1/projects/:id - Proyecto existente', () => {
        it('should return 200 and the project data', async () => {
            const projectData = buildProject();
            const project = await ProjectModel.create(projectData);

            const response = await request(app).get(`/v1/projects/${project._id}`);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(projectData.title);
        });
    });

    describe('GET /v1/projects/:id - Proyecto inexistente', () => {
        it('should return 404 for a non-existent project', async () => {
            const nonExistentId = new Types.ObjectId();
            const response = await request(app).get(`/v1/projects/${nonExistentId}`);
            expect(response.status).toBe(404);
            // El mensaje de error puede variar, así que solo verificamos que contenga el ID
            expect(response.text).toContain(nonExistentId.toHexString());
        });
    });

    describe('POST /v1/projects - Crear proyecto válido', () => {
        it('should create a new project and return 201', async () => {
            const newProject = buildProject({ title: 'New Factory Project' });

            const response = await request(app)
                .post('/v1/projects')
                .send(newProject);

            expect(response.status).toBe(201);
            expect(response.body.title).toBe(newProject.title);

            const projectInDb = await ProjectModel.findById(response.body._id);
            expect(projectInDb).not.toBeNull();
            expect(projectInDb?.title).toBe(newProject.title);
        });
    });

    describe('POST /v1/projects - Datos inválidos', () => {
        it('should return 400 if required data is missing', async () => {
            const invalidProject = {
                // title is missing
                description: 'An invalid project',
                version: '1.0',
                link: 'http://invalid.com',
                tag: 'invalid'
            };

            const response = await request(app)
                .post('/v1/projects')
                .send(invalidProject);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('"title" is required');
        });
    });
});
