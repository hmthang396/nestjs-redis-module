import { ModuleMetadata, Type } from '@nestjs/common';
import { ClusterNode, ClusterOptions, RedisOptions } from 'ioredis';
export type RedisClusterOption = {
    startupNodes: ClusterNode[];
    options?: ClusterOptions;
};
export type RedisNormalOption = RedisOptions;
export type RedisModuleOptions = {
    type: 'single';
    options: RedisNormalOption;
} | {
    type: 'cluster';
    options: RedisClusterOption;
};
export type RedisModuleOptionsFactory = {
    createRedisModuleOptions(): Promise<RedisModuleOptions> | RedisModuleOptions;
};
export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
    useClass?: Type<RedisModuleOptionsFactory>;
    useExisting?: Type<RedisModuleOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
}
type RedisBaseType = {
    redisKey?: string;
};
type RedisStringGetOption = RedisBaseType & {
    type: 'String';
};
type RedisListGetOption = RedisBaseType & {
    type: 'List';
    start: number | string;
    stop: number | string;
};
type RedisHashGetOption = (RedisBaseType & {
    type: 'Hash';
    isGetAll: false;
    field: string | Buffer;
}) | (RedisBaseType & {
    type: 'Hash';
    isGetAll: false;
    fields: (string | Buffer)[];
}) | (RedisBaseType & {
    type: 'Hash';
    isGetAll: true;
});
type RedisSetGetOption = RedisBaseType & {
    type: 'Set';
};
export type CacheInterceptorOptions = RedisStringGetOption | RedisListGetOption | RedisHashGetOption | RedisSetGetOption;
export {};
