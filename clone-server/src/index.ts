import 'reflect-metadata';
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import {ApolloServer } from "apollo-server-express";
import {buildSchema} from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from './resolvers/user';
import redis from "redis";
import session from 'express-session';
import connectRedis from "connect-redis";




const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();
    const redisClient = redis.createClient();
    redisClient.on('error', function(err) {
        console.log('Redis error: ' + err);
    });
    const RedisStore = connectRedis(session);
    app.use(
        session({
            name: 'qlIdCookie',
            store: new RedisStore({
                client: redisClient,
                disableTTL: true, 
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 360 * 34 * 365 * 10,// 10 years
                httpOnly: true,
                sameSite: 'lax',
                secure: __prod__, // cookie only works in https
            },
            saveUninitialized: false,
            secret: 'skjdflks567uencown$21ndlkfwoubwbcwnecoo',
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res }),
    });

    //creates graph endpoint on express
    apolloServer.applyMiddleware ({ app });
    app.listen(4000, () => {
        console.log('Server started on port 4000');
    })
};

main();