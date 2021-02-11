import { Entity as TOEntity, Column, JoinColumn, ManyToOne, BeforeInsert, Index } from 'typeorm'

import Entity from './Entity'
import User from './User'
import Post from './Post'

import { makeid } from '../utils/util'


@TOEntity('comments')
export default class Comment extends Entity {
    constructor(comment: Partial<Comment>) {
        super()
        Object.assign(this, comment)
    }


    @Index()
    @Column()
    identifier: string


    @Column()
    body: string

    @Column()
    username: string

    @ManyToOne(() => User)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user: User;


    @ManyToOne(() => Post, post => post.comments, { nullable: false })
    post: Post;

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeid(8)
    }
}