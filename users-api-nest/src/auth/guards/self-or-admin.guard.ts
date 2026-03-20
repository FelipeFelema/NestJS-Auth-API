import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const paramId = request.params.id;

        if (user.role === Role.ADMIN || user.id === paramId) {
            return true;
        }
        
        throw new ForbiddenException('Acess denied');
    }
}