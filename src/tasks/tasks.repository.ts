import { InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { User } from "../auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
    private logger = new Logger('TasksRepository', { timestamp: true })
    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        });

        await this.save(task);

        return task;
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const task  = await this.findOne({ where: { id, user }});
        if(!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return task;
    }
    
    async deleteTask(id: string, user: User): Promise<void> {
        var result = await this.delete({ id, user });
        if(result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = updateTaskStatusDto.status;

        await this.save(task);

        return task;
    }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        try {
            const { status, search } = filterDto;
            const query = this.createQueryBuilder('task');
            query.where({ user });

            if(status) {
                query.andWhere('task.status = :status', { status });
            }

            if(search) {
                query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${search}%` });
            }
            const tasks = await query.getMany();
            return tasks;
        }
        catch (error) {
            this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }                  
    }
}