import { Entity, Column, Index, ManyToOne } from 'typeorm';

import { BaseModelWithSeo } from 'src/abstracts/base-model-with-seo';
import { User } from 'src/users/user.entity';

@Entity('blogs')
export class Blog extends BaseModelWithSeo {
  @Column()
  title: string;

  @Index('slugIndex')
  @Column({
    unique: true,
  })
  slug: string;

  @Column()
  thumbImage: string;

  @Column()
  image: string;

  @Column()
  shortDescription: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column()
  isPublished: boolean;

  @ManyToOne(() => User, (user) => user.blogs, {
    nullable: false,
  })
  user: User;
}
