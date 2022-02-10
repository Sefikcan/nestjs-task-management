import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTasksFilterDto {
    @ApiProperty()
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @ApiProperty()
    @IsOptional()
    @IsString()
    search?: string;
}