import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, Role, User } from '@prisma/client';
import { ConflictException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    private sanitizeUser(user: any) {
        const {
            password,
            refreshTokenHash,
            refreshTokenId,
            ...safeUser
        } = user;

        return safeUser;
    }

    private userSelect = {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
    }

    async findAll(query: FindUsersQueryDto) {
        const { page, limit, search, role, sort, order } = query;

        const safePage = Number(page) ?? 1;
        const safeLimit = Number(limit) ?? 10;

        const where: Prisma.UserWhereInput = {};

        if (search) {
            where.email = {
                contains: search,
                mode: 'insensitive',
            };
        }

        if (role) {
            where.role = role;
        }

        const orderBy = sort
            ? { [sort]: order }
            : undefined;

        const users = await this.prisma.user.findMany({
            where,
            skip: (safePage - 1) * safeLimit,
            take: safeLimit,
            orderBy,
            select: this.userSelect,
        });

        const total = await this.prisma.user.count({ where });
        const totalPages = Math.ceil(total / safeLimit);

        return {
            data: users.map(user => this.sanitizeUser(user)),
            page: safePage,
            limit: safeLimit,
            total,
            totalPages,
            hasNextPage: safePage < totalPages,
            hasPreviousPage: safePage > 1,
        };
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: this.userSelect
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return this.sanitizeUser(user);
    }

    async findByIdInternal(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async create(createUserDto: CreateUserDto) {
        try {
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

            const user = await this.prisma.user.create({
                data: {
                    ...createUserDto,
                    password: hashedPassword,
                    role: Role.USER,
                },
                select: this.userSelect,
            });

            return this.sanitizeUser(user);

        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException('Email already exists');
            }

            throw error;
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        await this.findOne(id);

        const data = { ...updateUserDto };

        // If password is being updated, hash it before saving
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        try {
            const updateUser = await this.prisma.user.update({
            where: { id },
            data,
            select: this.userSelect
        });

        return this.sanitizeUser(updateUser);

        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException('Email already exists')
            }
            throw error;
        }
        
    }

    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.user.delete({
            where: { id },
        });
    }

    async updateRefreshToken(userId: string, refreshToken: string | null, refreshTokenId?: string) {
        const data: any = {};

        if (refreshToken) {
            data.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
            data.refreshTokenId = refreshTokenId ?? null;
        } else {
            data.refreshTokenHash = null;
            data.refreshTokenId = null;
        }

        await this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }
}
