import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Observable, of } from 'rxjs';
import { InjectRedis } from './redis.decorator';
import { Reflector } from '@nestjs/core';
import { CacheInterceptorOptions } from './redis.type';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    private reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const options = this.reflector.get<CacheInterceptorOptions>('CacheInterceptorOptions', context.getHandler());

    const cacheKey = options.redisKey ?? this.generateDefaultCacheKey(request);

    options.redisKey = cacheKey;

    const cache = await this.getFromCache(options);

    if (cache) {
      return of(JSON.parse(cache));
    }

    return next.handle().pipe();
  }

  private generateDefaultCacheKey(request: any): string {
    const { method, originalUrl, query, params } = request;
    return `${method}:${originalUrl}:${JSON.stringify(params)}:${JSON.stringify(query)}`;
  }

  private async getFromCache(options: CacheInterceptorOptions) {
    switch (options.type) {
      case 'String':
        return await this.redis.get(options.redisKey);
      case 'List':
        const { start, stop } = options;
        return JSON.stringify((await this.redis.lrange(options.redisKey, start, stop)) as string[]);
      case 'Hash':
        const { isGetAll, redisKey } = options;
        if (isGetAll) return JSON.stringify(await this.redis.hgetall(redisKey));
        if ('field' in options) return JSON.stringify(await this.redis.hget(redisKey, options['field']));
        if ('fields' in options) return JSON.stringify(await this.redis.hmget(redisKey, ...options['fields']));
      case 'Set':
        return JSON.stringify(await this.redis.smembers(options.redisKey));
      default:
        return null;
    }
  }
}
