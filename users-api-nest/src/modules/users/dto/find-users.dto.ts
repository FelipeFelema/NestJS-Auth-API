import { IsOptional, IsInt, Min, Max, IsEnum, IsString, } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Role } from '@prisma/client';

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export enum UserSortField {
    EMAIL = 'email',
    CREATED_AT = 'createdAt',
}

export class FindUsersQueryDto {

    @IsOptional()
    @Type(() => Number) // Transform Query string to number
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit: number = 10;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Transform(({ value }) => value.toUpperCase()) // Normalize role to uppercase
    @IsEnum(Role)
    role?: Role;

    @IsOptional()
    @IsEnum(UserSortField)
    sort?: UserSortField;

    @IsOptional()
    @IsEnum(SortOrder)
    order: SortOrder = SortOrder.ASC;
}