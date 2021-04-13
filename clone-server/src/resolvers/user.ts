import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';
// another way to use @Arg
@InputType()
class UsernamePassword {
    @Field()
    username: string;

    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    msg: string;
}

// Error handling class
@ObjectType()
class LoginResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User
}

@Resolver()
export class UserResolver{

    @Query(() => User, {nullable: true})
    async me(
        @Ctx() { req, em }: MyContext
    ) {
        // you are not logged in
        console.log('session:', req.session);
        if (!req.session.sessionID) {
            return null
        }
        const user = await em.findOne(User, {id: parseInt(req.session.sessionID)});
        return user;
    }



    @Mutation(() => LoginResponse)
    async register(@Arg('input') input: UsernamePassword,
             @Ctx() {em,req}: MyContext): Promise<LoginResponse>{
        if (input.username.length <= 2) {
            return {
                errors: [
                    {
                        field: 'username',
                        msg: 'username must be greater than 2 symbols long!'
                    },
                ],
            };
        }
        if (input.password.length <= 5) {
            return {
                errors: [
                    {
                        field: 'password',
                        msg: 'password must be at least 6 symbols long!'
                    },
                ],
            };
        }
        // using argon2 lib to hash passwords, so we don't store them as strings in db
        const hashedPwd = await argon2.hash(input.password);
        const user = em.create(User, {username: input.username, password: hashedPwd});
        try {
            await em.persistAndFlush(user);
        }catch (err) {
            if (err.code === "23505" || err.detail.includes("already exists")) {
                return {
                    errors: [
                        {
                            field: 'username',
                            msg: 'Username laready exists'
                        },
                    ],
                };
            }
        }
        req.session.sessionID = user.id.toString();
        return {user};
    }

    @Mutation(() => LoginResponse)
    async login(@Arg('input') input: UsernamePassword,
             @Ctx() {em, req}: MyContext): Promise<LoginResponse> {
        const user = await em.findOne(User, {username: input.username});
        if (!user) {
            return {
                errors: [{
                    field: 'username',
                    msg: 'Username does not exist',
                    },
                ],
            };
        }
        const pwd = await argon2.verify(user.password, input.password);
        if (!pwd) {
            return {
                    errors: [{
                        field: 'password',
                        msg: 'invalid login',
                    },
                ],
            };
        }
        req.session.sessionID = user.id.toString();
        return {user};
    }
}
