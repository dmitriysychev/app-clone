import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from 'path';
import { User } from "./entities/User";

export default {
    migrations: {
        path: path.join(__dirname, './migrations'), 
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post, User],
    dbName: "",
    user: "",
    password: "",
    //user, pwd?
    type: "postgresql",
    //it means when we are not in production, debugging is on. 
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
