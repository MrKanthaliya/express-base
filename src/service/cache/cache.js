import redis from 'redis';
import Boom from 'boom';
import { promisify } from 'util';

class RedisClient {
    constructor(options = {}) {
        if (!RedisClient.instance) {
            this.options = {};
            this.client;
            RedisClient.instance = this;
        }
        Object.assign(this, RedisClient.instance);
        const defaultOptions = {
            ttl: 24 * 60 * 60 * 1000, // 1 day
            partition: 'Redis-prefix',
        };

        Object.assign(this.options, options, defaultOptions);
    }

    async init() {
        const client = await redis.createClient({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            // retry_strategy: () => 1000,
        });
        client.on('error', function (error) {
            logger.error("redis server issue", error)
        });
        client.get = promisify(client.get);
        client.smembers = promisify(client.smembers);
        this.client = client;
        return this.client;
    }

    async get(key) {
        if (key === null) {
            return null;
        }

        if (!this.client) {
            throw Error('Connection not started');
        }

        const _key = { segment: this.data.segment, id: typeof key === 'string' ? key : key.id };

        this.validate(_key);

        const result = await this.client.get(this.generateKey(_key));
        if (!result) {
            const response = await this.data.generateFunc(key);
            this.set(_key, response);
            return response;
        }

        try {
            var envelope = JSON.parse(result);
        } catch (ignoreErr) {} // Handled by validation below

        if (!envelope) {
            throw Error('Bad envelope content');
        }

        if (!envelope.stored || !envelope.hasOwnProperty('item')) {
            throw Error('Incorrect envelope structure');
        }

        if (!envelope || envelope.item === undefined || envelope.item === null) {
            return null; // Not found
        }

        const now = Date.now();
        const expires = envelope.stored + envelope.ttl;
        const ttl = expires - now;
        if (ttl <= 0) {
            return null; // Expired
        }

        const cached = {
            item: envelope.item,
            stored: envelope.stored,
            ttl,
        };

        return cached.item;
    }

    set(key, value, ttl = this.options.ttl) {
        if (ttl <= 0) {
            return; // Not cachable (or bad rules)
        }
        if (!this.client) {
            throw Error('Connection not started');
        }

        const _key = { segment: this.data.segment, id: typeof key === 'string' ? key : key.id };

        this.validate(_key);

        const envelope = {
            item: value,
            stored: Date.now(),
            ttl,
        };

        const cacheKey = this.generateKey(_key);
        const stringifiedEnvelope = JSON.stringify(envelope);

        return this.client.psetex(cacheKey, ttl, stringifiedEnvelope);
    }

    drop(key) {
        const _key = { segment: this.data.segment, id: typeof key === 'string' ? key : key.id };

        this.validate(_key);

        if (!this.client) {
            throw Error('Connection not started');
        }

        return this.client.del(this.generateKey(_key));
    }

    isReady() {
        return !!this.client && this.client.ready;
    }

    generateKey({ id, segment }) {
        const parts = [];

        if (this.options.partition) {
            parts.push(encodeURIComponent(this.options.partition));
        }

        if (segment) {
            parts.push(encodeURIComponent(segment));
        }
        parts.push(encodeURIComponent(id));

        return parts.join(':');
    }

    validate(key, allow = {}) {
        if (!this.isReady()) {
            throw Boom.internal('Disconnected'); // Disconnected
        }

        const isValidKey = key && typeof key.id === 'string' && typeof key.segment === 'string';

        if (!isValidKey && key !== allow) {
            throw Boom.internal('Invalid key');
        }
    }

    async cache(lala) {
        this.data = lala;
        return this;
    }
}

export default RedisClient;
