import {
    Entity as TOEntity,
    Column,
    Index,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";

import Post from "./Post";

@TOEntity("subs")
export default class Sub extends Entity {
    constructor(sub: Partial<Sub>) {
        super();
        Object.assign(this, sub);
    }


    @Index()
    @Column({ unique: true })
    name: string


    @Index()
    @Column({ nullable: true })
    title: string


    @Index()
    @Column({ type: 'text', nullable: true })
    description: string

    @Index()
    @Column({ nullable: true })
    imageUrn: string


    @Index()
    @Column({ nullable: true })
    bannerUrn: string


    @ManyToOne(() => User)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user: User;


    @OneToMany(() => Post, post => post.sub)
    posts: Post[]








}
