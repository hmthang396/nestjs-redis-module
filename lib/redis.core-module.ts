import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { RedisModuleAsyncOptions, RedisModuleOptions, RedisModuleOptionsFactory } from './redis.type';
import { createRedisConnection, getRedisConnectionToken, getRedisOptionsToken } from './redis.utils';
import { CacheInterceptor } from './redis.interceptor';

@Module({
  imports: [],
  providers: [CacheInterceptor],
})
@Global()
export class RedisCoreModule {
  /**
   * Configures the module with the provided Redis options and creates the necessary providers.
   * This method is for synchronous configuration.
   *
   * @param options - The options to configure the Redis connection.
   * @param connection - An optional connection name to distinguish between different Redis connections.
   * @returns A dynamic module with Redis providers.
   */
  static forRoot(options: RedisModuleOptions, connection?: string): DynamicModule {
    const redisOptionsProvider: Provider = {
      provide: getRedisOptionsToken(connection),
      useValue: options,
    };

    const redisConnectionProvider: Provider = {
      provide: getRedisConnectionToken(connection),
      useValue: createRedisConnection(options),
    };

    return {
      module: RedisCoreModule,
      providers: [redisOptionsProvider, redisConnectionProvider],
      exports: [redisOptionsProvider, redisConnectionProvider],
    };
  }

  /**
   * Configures the module asynchronously with the provided options and creates the necessary providers.
   * This method is for asynchronous configuration.
   *
   * @param options - The async options to configure the Redis connection.
   * @param connection - An optional connection name to distinguish between different Redis connections.
   * @returns A dynamic module with Redis providers.
   */
  static forRootAsync(options: RedisModuleAsyncOptions, connection?: string): DynamicModule {
    const redisConnectionProvider: Provider = {
      inject: [getRedisOptionsToken(connection)],
      provide: getRedisConnectionToken(connection),
      useFactory: (options: RedisModuleOptions) => createRedisConnection(options),
    };

    const asyncRedisProvider = this.createAsyncProviders(options, connection);

    return {
      module: RedisCoreModule,
      imports: options.imports || [],
      providers: [...asyncRedisProvider, redisConnectionProvider],
      exports: [redisConnectionProvider],
    };
  }

  /**
   * Creates async providers based on the provided async options.
   * This method handles the logic of whether to use an existing provider, a factory function, or a class.
   *
   * @param options - The async options to configure the Redis connection.
   * @param connection - An optional connection name to distinguish between different Redis connections.
   * @returns An array of providers for the Redis module.
   */
  private static createAsyncProviders(options: RedisModuleAsyncOptions, connection?: string) {
    if (!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting');
    }

    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options, connection)];
    }

    const providers: Provider[] = [this.createAsyncOptionsProvider(options, connection)];

    if (options.useClass) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });
    }

    return providers;
  }

  /**
   * Creates a provider for the async Redis options. This handles the async creation of Redis options.
   *
   * @param options - The async options to configure the Redis connection.
   * @param connection - An optional connection name to distinguish between different Redis connections.
   * @returns A provider for the Redis options.
   */
  private static createAsyncOptionsProvider(options: RedisModuleAsyncOptions, connection?: string) {
    if (!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting');
    }

    if (options.useFactory) {
      return {
        provide: getRedisOptionsToken(connection),
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: getRedisOptionsToken(connection),
      useFactory: async (optionsFactory: RedisModuleOptionsFactory): Promise<RedisModuleOptions> =>
        await optionsFactory.createRedisModuleOptions(),
      inject: [options.useClass, options.useExisting],
    };
  }
}
