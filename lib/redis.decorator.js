"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheOption = exports.InjectRedis = void 0;
exports.UseCache = UseCache;
const common_1 = require("@nestjs/common");
const redis_utils_1 = require("./redis.utils");
const redis_interceptor_1 = require("./redis.interceptor");
const InjectRedis = (connection) => {
    return (0, common_1.Inject)((0, redis_utils_1.getRedisConnectionToken)(connection));
};
exports.InjectRedis = InjectRedis;
const CacheOption = (option) => (0, common_1.SetMetadata)('CacheInterceptorOptions', option);
exports.CacheOption = CacheOption;
function UseCache() {
    return (0, common_1.applyDecorators)((0, common_1.UseInterceptors)(redis_interceptor_1.CacheInterceptor));
}
//# sourceMappingURL=redis.decorator.js.map