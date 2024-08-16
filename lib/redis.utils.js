"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisConnection = exports.getRedisConnectionToken = exports.getRedisOptionsToken = void 0;
const ioredis_1 = require("ioredis");
const redis_constants_1 = require("./redis.constants");
const common_1 = require("@nestjs/common");
const getRedisOptionsToken = (connection = redis_constants_1.REDIS_CONNECTION) => `${connection}_${redis_constants_1.REDIS_OPTIONS_TOKEN}`;
exports.getRedisOptionsToken = getRedisOptionsToken;
const getRedisConnectionToken = (connection = redis_constants_1.REDIS_CONNECTION) => `${connection}_${redis_constants_1.REDIS_CONNECTION_TOKEN}`;
exports.getRedisConnectionToken = getRedisConnectionToken;
const createRedisConnection = (options) => {
    const { type } = options;
    let redis = undefined;
    switch (type) {
        case 'single':
            const { options: commonOptions } = options;
            redis = new ioredis_1.Redis(commonOptions);
            redis.on('connect', () => {
                common_1.Logger.log(`Trying to connect to Redis`, `RedisConnection`);
            });
            redis.on('close', () => {
                common_1.Logger.error(`Disconnected connected to Redis`, `RedisConnection`);
            });
            redis.on('ready', () => {
                common_1.Logger.log(`Successfully connected to Redis`, `RedisConnection`);
            });
            return redis;
        case 'cluster':
            const { options: commonClusterOptions } = options;
            redis = new ioredis_1.Cluster(commonClusterOptions.startupNodes, commonClusterOptions.options);
            redis.on('connect', () => {
                common_1.Logger.log(`Trying to connect to Redis`, `RedisConnection`);
            });
            redis.on('close', () => {
                common_1.Logger.error(`Disconnected connected to Redis`, `RedisConnection`);
            });
            redis.on('ready', () => {
                common_1.Logger.log(`Successfully connected to Redis`, `RedisConnection`);
            });
            return redis;
        default:
            throw new Error('Invalid configuration');
    }
};
exports.createRedisConnection = createRedisConnection;
//# sourceMappingURL=redis.utils.js.map