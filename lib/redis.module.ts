import { DynamicModule, Module } from '@nestjs/common';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.type';
import { RedisCoreModule } from './redis.core-module';

@Module({})
export class RedisModule {
  public static forRoot(options: RedisModuleOptions, connection?: string): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRoot(options, connection)],
      exports: [RedisCoreModule],
    };
  }

  public static forRootAsync(options: RedisModuleAsyncOptions, connection?: string): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRootAsync(options, connection)],
      exports: [RedisCoreModule],
    };
  }
}
