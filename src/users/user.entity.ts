import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseModel } from 'src/abstracts/base-model';
import { Blog } from 'src/blogs/blog.entity';
import { UserRoles } from './user.roles';

@Entity('users')
export class User extends BaseModel {
  @Index('emailIndex')
  @Column()
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column()
  fullName: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    default: false,
  })
  verified: boolean;

  @Column({
    nullable: true,
    select: false,
  })
  verificationToken: string;

  @Column({
    nullable: true,
    select: false,
  })
  passwordResetToken: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: UserRoles;

  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];
}
