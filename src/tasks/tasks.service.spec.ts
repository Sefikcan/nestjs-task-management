import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    getTaskById: jest.fn()
});

const mockUser: User = {
    username: 'sefikcan',
    id: 'someId',
    password: 'somePasword',
    task:[]
};

const mockTask: Task = {
    title: 'Test title',
    description: 'Test desc',
    id: 'someId',
    status: TaskStatus.OPEN,
    user: null
};

describe('TasksService', () => {
    let tasksService: TasksService;
    let tasksRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [TasksService, { provide: TasksRepository, useFactory: mockTasksRepository }],
        }).compile();

        tasksService = module.get(TasksService);
        tasksRepository = module.get(TasksRepository);
    });

    describe('getTasks', () => {
        it('calls TasksRepository.getTasks and return the result', async () => {
            tasksRepository.getTasks.mockResolvedValue('someValue');
            const result = await tasksService.getTasks(null, mockUser);
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('calls TasksRepository.findOne and returns the result', async () => {
            tasksRepository.getTaskById.mockResolvedValue(mockTask);
            const result = await tasksService.getTaskById('someId', mockUser);
            expect(result).toEqual(mockTask);
        });
    });
});