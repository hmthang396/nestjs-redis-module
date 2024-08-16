import { Inject, SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { getRedisConnectionToken } from './redis.utils';
import { CacheInterceptorOptions } from './redis.type';
import { CacheInterceptor } from './redis.interceptor';

export const InjectRedis = (connection?: string) => {
  return Inject(getRedisConnectionToken(connection));
};

export const CacheOption = (option: CacheInterceptorOptions) => SetMetadata('CacheInterceptorOptions', option);

export function UseCache() {
  return applyDecorators(UseInterceptors(CacheInterceptor));
}
