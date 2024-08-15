import { ModuleMetadata, Type } from '@nestjs/common';
import { ClusterNode, ClusterOptions, RedisOptions } from 'ioredis';

/**
 * Defines the options required for configuring a Redis Cluster.
 */
export type RedisClusterOption = {
  /**
   * An array of nodes that form the Redis Cluster.
   */
  startupNodes: ClusterNode[];
  /**
   * Optional additional configuration for the Redis Cluster.
   */
  options?: ClusterOptions;
};

/**
 * Defines the options required for configuring a single Redis instance.
 */
export type RedisNormalOption = RedisOptions;

/**
 * Defines the overall options for configuring the Redis module,
 * supporting both single instance and cluster configurations.
 */
export type RedisModuleOptions =
  | {
      type: 'single'; // Indicates a single Redis instance
      options: RedisNormalOption; // Options specific to a single Redis instance
    }
  | {
      type: 'cluster'; // Indicates a Redis Cluster
      options: RedisClusterOption; // Options specific to a Redis Cluster
    };

/**
 * An interface for a factory that creates RedisModuleOptions.
 * This is useful for dynamically configuring the Redis module.
 */
export type RedisModuleOptionsFactory = {
  /**
   * A method to create and return RedisModuleOptions.
   * Can be synchronous or asynchronous.
   */
  createRedisModuleOptions(): Promise<RedisModuleOptions> | RedisModuleOptions;
};

/**
 * Defines the options for configuring the Redis module asynchronously.
 */
export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Optional array of providers to inject.
   */
  inject?: any[];

  /**
   * Optional class that implements the RedisModuleOptionsFactory interface.
   */
  useClass?: Type<RedisModuleOptionsFactory>;

  /**
   * Optional existing class that implements the RedisModuleOptionsFactory interface.
   */
  useExisting?: Type<RedisModuleOptionsFactory>;

  /**
   * Optional factory function that returns RedisModuleOptions.
   * Can be synchronous or asynchronous.
   */
  useFactory?: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
}

type RedisBaseType = { redisKey?: string };

type RedisStringGetOption = RedisBaseType & { type: 'String' };

type RedisListGetOption = RedisBaseType & { type: 'List'; start: number | string; stop: number | string };

type RedisHashGetOption =
  | (RedisBaseType & { type: 'Hash'; isGetAll: false; field: string | Buffer })
  | (RedisBaseType & { type: 'Hash'; isGetAll: false; fields: (string | Buffer)[] })
  | (RedisBaseType & { type: 'Hash'; isGetAll: true });

type RedisSetGetOption = RedisBaseType & { type: 'Set' };

export type CacheInterceptorOptions =
  | RedisStringGetOption
  | RedisListGetOption
  | RedisHashGetOption
  | RedisSetGetOption;
