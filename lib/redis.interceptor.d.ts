import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
export declare class CacheInterceptor implements NestInterceptor {
    private readonly redis;
    private reflector;
    constructor(redis: Redis, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>>;
    private generateDefaultCacheKey;
    private getFromCache;
}
