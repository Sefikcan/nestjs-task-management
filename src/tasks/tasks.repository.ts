import { NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN
        });

        await this.save(task);

        return task;
    }

    async getTaskById(id: string): Promise<Task> {
        const task  = await this.findOne(id);
        if(!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return task;
    }
    
    async deleteTask(id: string): Promise<void> {
        var result = await this.delete(id);
        if(result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = updateTaskStatusDto.status;

        await this.save(task);

        return task;
    }

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        if(status) {
            query.andWhere('task.status = :status', { status });
        }

        if(search) {
            query.andWhere('LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)', { search: `%${search}%` });
        }

        const tasks = await query.getMany();
        return tasks;
    }
}