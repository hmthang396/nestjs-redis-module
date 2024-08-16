import { CacheInterceptorOptions } from './redis.type';
export declare const InjectRedis: (connection?: string) => PropertyDecorator & ParameterDecorator;
export declare const CacheOption: (option: CacheInterceptorOptions) => import("@nestjs/common").CustomDecorator<string>;
export declare function UseCache(): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
