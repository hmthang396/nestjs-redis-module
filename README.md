Redis Module for NestJS
This repository contains a custom Redis module designed specifically for the NestJS framework. It provides seamless integration with Redis, allowing developers to easily manage Redis connections, cache data, and enhance the performance of their NestJS applications. This module is built to support both synchronous and asynchronous initialization, making it adaptable to various project requirements.

Features
Flexible Configuration: Easily configure Redis connections using standard or environment-based options.
Dynamic Module Support: The module can be initialized synchronously or asynchronously, providing flexibility for complex configurations.
Custom Redis Decorators: Includes decorators like InjectRedis to simplify injecting Redis clients into your services.
Caching Interceptor: Leverage a built-in caching interceptor that checks Redis for cached responses before querying your database.
TypeScript Support: Fully written in TypeScript, ensuring strong typing and better integration with modern NestJS projects.

## Installation

Install the module via npm:

```bash
npm install nest-redis-module
```

## Usage

# Basic Setup

In your application's module, import and configure the Redis module:

```bash
import { Module } from '@nestjs/common';
import { RedisModule } from 'nest-redis-module';

@Module({
  imports: [
    RedisModule.forRoot({
      host: 'localhost',
      port: 6379,
      // other Redis options
    }),
  ],
})
export class AppModule {}

```

# Asynchronous Configuration

You can also configure the module asynchronously, which is useful when your configuration depends on external services:

```bash
import { Module } from '@nestjs/common';
import { RedisModule } from 'nest-redis-module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'single',
          options: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT_NUMBER'),
          },
        };
      },
    }),
  ],
})
export class AppModule {}
```
## Using InjectRedis in Services
```bash
import { Injectable } from '@nestjs/common';
import { InjectRedis } from 'nest-redis-module';
import { Redis } from 'ioredis';

@Injectable()
export class MyService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  async getValue(key: string): Promise<string> {
    return this.redisClient.get(key);
  }
}

```
## Contributing
Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or features to add.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
