import { Injectable } from '@nestjs/common';
import { Task } from './task.model';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository)
        private taskRepository: TasksRepository
        ){}

    getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto);
    }

    getTaskById(id: string): Promise<Task> {
        return this.taskRepository.getTaskById(id);
    }

    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    deleteTask(id: string): Promise<void> {
        return this.taskRepository.deleteTask(id);
    }

    updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task> {
        return this.taskRepository.updateTaskStatus(id, updateTaskStatusDto);
    }
}
