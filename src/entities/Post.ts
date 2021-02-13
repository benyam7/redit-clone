import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
  AfterLoad,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";
import { makeid, slugify } from "../utils/util";
import Sub from "./Sub";
import Comment from "./Comment";
import { Expose } from "class-transformer";
import Vote from "./Vote";

@TOEntity("posts")
export default class Post extends Entity {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Index()
  @Column()
  identitfier: string; // 7 char id

  @Index()
  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: "text" })
  body: string;

  @Column()
  subName: string;

  @Column()
  username: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "subName", referencedColumnName: "name" })
  sub: Sub;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  @BeforeInsert()
  makeIdAndSlug() {
    this.identitfier = makeid(7);
    this.slug = slugify(this.title);
  }

  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identitfier}/${this.slug}`;
  }
  // protected url: string;
  // @AfterLoad()
  // createFields() {
  //   this.url = `/r/${this.subName}/${this.identitfier}/${this.slug}`;
  // }
}
