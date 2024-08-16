import { DynamicModule } from '@nestjs/common';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.type';
export declare class RedisCoreModule {
    static forRoot(options: RedisModuleOptions, connection?: string): DynamicModule;
    static forRootAsync(options: RedisModuleAsyncOptions, connection?: string): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
