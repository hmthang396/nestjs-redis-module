"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const rxjs_1 = require("rxjs");
const redis_decorator_1 = require("./redis.decorator");
const core_1 = require("@nestjs/core");
let CacheInterceptor = class CacheInterceptor {
    constructor(redis, reflector) {
        this.redis = redis;
        this.reflector = reflector;
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const options = this.reflector.get('CacheInterceptorOptions', context.getHandler());
        const cacheKey = options.redisKey ?? this.generateDefaultCacheKey(request);
        options.redisKey = cacheKey;
        const cache = await this.getFromCache(options);
        if (cache) {
            return (0, rxjs_1.of)(JSON.parse(cache));
        }
        return next.handle().pipe();
    }
    generateDefaultCacheKey(request) {
        const { method, originalUrl, query, params } = request;
        return `${method}:${originalUrl}:${JSON.stringify(params)}:${JSON.stringify(query)}`;
    }
    async getFromCache(options) {
        switch (options.type) {
            case 'String':
                return await this.redis.get(options.redisKey);
            case 'List':
                const { start, stop } = options;
                return JSON.stringify((await this.redis.lrange(options.redisKey, start, stop)));
            case 'Hash':
                const { isGetAll, redisKey } = options;
                if (isGetAll)
                    return JSON.stringify(await this.redis.hgetall(redisKey));
                if ('field' in options)
                    return JSON.stringify(await this.redis.hget(redisKey, options['field']));
                if ('fields' in options)
                    return JSON.stringify(await this.redis.hmget(redisKey, ...options['fields']));
            case 'Set':
                return JSON.stringify(await this.redis.smembers(options.redisKey));
            default:
                return null;
        }
    }
};
exports.CacheInterceptor = CacheInterceptor;
exports.CacheInterceptor = CacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, redis_decorator_1.InjectRedis)()),
    __metadata("design:paramtypes", [ioredis_1.Redis,
        core_1.Reflector])
], CacheInterceptor);
//# sourceMappingURL=redis.interceptor.js.map