"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RedisCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCoreModule = void 0;
const common_1 = require("@nestjs/common");
const redis_utils_1 = require("./redis.utils");
const redis_interceptor_1 = require("./redis.interceptor");
let RedisCoreModule = RedisCoreModule_1 = class RedisCoreModule {
    static forRoot(options, connection) {
        const redisOptionsProvider = {
            provide: (0, redis_utils_1.getRedisOptionsToken)(connection),
            useValue: options,
        };
        const redisConnectionProvider = {
            provide: (0, redis_utils_1.getRedisConnectionToken)(connection),
            useValue: (0, redis_utils_1.createRedisConnection)(options),
        };
        return {
            module: RedisCoreModule_1,
            providers: [redisOptionsProvider, redisConnectionProvider],
            exports: [redisOptionsProvider, redisConnectionProvider],
        };
    }
    static forRootAsync(options, connection) {
        const redisConnectionProvider = {
            inject: [(0, redis_utils_1.getRedisOptionsToken)(connection)],
            provide: (0, redis_utils_1.getRedisConnectionToken)(connection),
            useFactory: (options) => (0, redis_utils_1.createRedisConnection)(options),
        };
        const asyncRedisProvider = this.createAsyncProviders(options, connection);
        return {
            module: RedisCoreModule_1,
            imports: options.imports || [],
            providers: [...asyncRedisProvider, redisConnectionProvider],
            exports: [redisConnectionProvider],
        };
    }
    static createAsyncProviders(options, connection) {
        if (!(options.useExisting || options.useFactory || options.useClass)) {
            throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting');
        }
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options, connection)];
        }
        const providers = [this.createAsyncOptionsProvider(options, connection)];
        if (options.useClass) {
            providers.push({
                provide: options.useClass,
                useClass: options.useClass,
            });
        }
        return providers;
    }
    static createAsyncOptionsProvider(options, connection) {
        if (!(options.useExisting || options.useFactory || options.useClass)) {
            throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting');
        }
        if (options.useFactory) {
            return {
                provide: (0, redis_utils_1.getRedisOptionsToken)(connection),
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: (0, redis_utils_1.getRedisOptionsToken)(connection),
            useFactory: async (optionsFactory) => await optionsFactory.createRedisModuleOptions(),
            inject: [options.useClass, options.useExisting],
        };
    }
};
exports.RedisCoreModule = RedisCoreModule;
exports.RedisCoreModule = RedisCoreModule = RedisCoreModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [redis_interceptor_1.CacheInterceptor],
    }),
    (0, common_1.Global)()
], RedisCoreModule);
//# sourceMappingURL=redis.core-module.js.map