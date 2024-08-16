import { Cluster, Redis } from 'ioredis';
import { RedisModuleOptions } from './redis.type';
export declare const getRedisOptionsToken: (connection?: string) => string;
export declare const getRedisConnectionToken: (connection?: string) => string;
export declare const createRedisConnection: (options: RedisModuleOptions) => Redis | Cluster;
