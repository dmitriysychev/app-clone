import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver{
    @Query(() => [Post]) //graphql type
    posts (@Ctx() {em}: MyContext): Promise<Post[]> { //ts type
        return em.find(Post, {})
    }

    @Query(() => Post, {nullable: true}) //graphql type
    post (
        @Arg('id', () => Int) id: number, 
        @Ctx() {em}: MyContext): Promise<Post | null> { //ts type
        return em.findOne(Post, { id });
    }

    // mutation for editing data (inserting, deleting, etc)
    @Mutation(() => Post) //graphql type
    async createPost (
        // technically ql can infer the type so specifiying String is not necessary
        @Arg('title', () => String) title: string, 
        @Ctx() {em}: MyContext): Promise<Post> { //ts type
        const post = em.create(Post, {title});
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post, {nullable: true}) //graphql type
    async updatePost (
        @Arg('id') id: number,
        // nullable true allows for the title to be null
        @Arg('title', () => String, {nullable: true}) title: string, 
        @Ctx() {em}: MyContext): Promise<Post | null> { //ts type
        const post = await em.findOne(Post, {id});
        if (!post) {
            return null;
        }
        if (typeof title !== 'undefined') {
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post;
    }

    @Mutation(() => Boolean) //graphql type
    async deletePost (
        @Arg('id') id: number,
        @Ctx() {em}: MyContext): Promise<Boolean> { //ts type
        await em.nativeDelete(Post, { id })
        return true;
    }
}