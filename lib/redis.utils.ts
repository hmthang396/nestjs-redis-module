import { Cluster, Redis } from 'ioredis';
import { REDIS_CONNECTION, REDIS_CONNECTION_TOKEN, REDIS_OPTIONS_TOKEN } from './redis.constants';
import { RedisModuleOptions } from './redis.type';
import { Logger } from '@nestjs/common';

/**
 * Generates a provider token for Redis module options.
 *
 * @param connection - The name of the Redis connection. Defaults to 'REDIS_CONNECTION'.
 * @returns A string token combining the connection name and 'REDIS_OPTIONS_TOKENs'.
 */
export const getRedisOptionsToken = (connection: string = REDIS_CONNECTION): string =>
  `${connection}_${REDIS_OPTIONS_TOKEN}`;

/**
 * Generates a provider token for the Redis connection instance.
 *
 * @param connection - The name of the Redis connection. Defaults to 'REDIS_CONNECTION'.
 * @returns A string token combining the connection name and 'REDIS_CONNECTION_TOKEN'.
 */
export const getRedisConnectionToken = (connection: string = REDIS_CONNECTION): string =>
  `${connection}_${REDIS_CONNECTION_TOKEN}`;

/**
 * Creates a Redis or Redis Cluster connection based on the provided options.
 *
 * @param options - The configuration options for the Redis connection.
 * @returns A Redis or Cluster instance based on the specified type.
 * @throws Will throw an error if the configuration type is invalid.
 */
export const createRedisConnection = (options: RedisModuleOptions) => {
  const { type } = options; // Extracting the type of Redis connection from options
  let redis: undefined | Redis | Cluster = undefined;
  switch (type) {
    case 'single':
      const { options: commonOptions } = options; // Extracting common options for single Redis instance
      redis = new Redis(commonOptions); // Returning a new Redis instance
      redis.on('connect', () => {
        Logger.log(`Trying to connect to Redis`, `RedisConnection`);
      });
      redis.on('close', () => {
        Logger.error(`Disconnected connected to Redis`, `RedisConnection`);
      });
      redis.on('ready', () => {
        Logger.log(`Successfully connected to Redis`, `RedisConnection`);
      });
      return redis;
    case 'cluster':
      const { options: commonClusterOptions } = options; // Extracting options for Redis Cluster
      redis = new Cluster(commonClusterOptions.startupNodes, commonClusterOptions.options); // Returning a new Redis Cluster instance
      redis.on('connect', () => {
        Logger.log(`Trying to connect to Redis`, `RedisConnection`);
      });
      redis.on('close', () => {
        Logger.error(`Disconnected connected to Redis`, `RedisConnection`);
      });
      redis.on('ready', () => {
        Logger.log(`Successfully connected to Redis`, `RedisConnection`);
      });
      return redis;
    default:
      throw new Error('Invalid configuration'); // Throwing an error if the type is neither 'single' nor 'cluster'
  }
};
