import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { generateRandomString } from 'src/utils/string';
import { Blog } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { PatchBlogDto } from './dto/patch-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async createBlog(createBlogDto: CreateBlogDto, user: User): Promise<Blog> {
    let slug = slugify(createBlogDto.title.toLowerCase(), '-');
    const existingBlog = await this.blogRepository.findOneBy({
      slug,
    });

    if (existingBlog) {
      slug += '-' + generateRandomString(5);
    }

    const blog = await this.blogRepository.save(
      this.blogRepository.create({ ...createBlogDto, slug, user }),
    );
    return blog;
  }

  async updateBlog(id: string, createBlogDto: CreateBlogDto): Promise<any> {
    const result = await this.blogRepository.update(
      { id },
      { ...createBlogDto },
    );

    if (!result.affected) {
      throw new NotFoundException('Blog not found');
    }

    const blog = this.blogRepository.findOneBy({
      id,
    });

    return blog;
  }

  async patchBlog(id: string, patchBlogDto: PatchBlogDto): Promise<any> {
    const result = await this.blogRepository.update(
      { id },
      { ...patchBlogDto },
    );

    if (!result.affected) {
      throw new NotFoundException('Blog not found');
    }

    const blog = this.blogRepository.findOneBy({
      id,
    });

    return blog;
  }

  async deleteBlog(id: string): Promise<any> {
    const result = await this.blogRepository.delete({
      id,
    });

    if (!result.affected) {
      throw new NotFoundException('Blog not found');
    }
  }

  async getBlog(id: string): Promise<any> {
    const found = await this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .where('blog.id = :id', { id })
      .getOne();

    if (!found) {
      throw new NotFoundException('Blog not found');
    }

    return found;
  }

  async getBlogs(page = 1, limit = 10, search = ''): Promise<any> {
    const offset = (page - 1) * limit;
    let query = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user');

    if (search) {
      query = query.where('blog.title like :search', { search: `%${search}%` });
    }

    const [results, count] = await query
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      page,
      limit,
      count,
      results,
    };
  }

  async getBlogForPublic(slug: string): Promise<any> {
    const found = await this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .where('blog.slug = :slug', { slug })
      .getOne();

    if (!found) {
      throw new NotFoundException('Blog not found');
    }

    return found;
  }

  async getBlogsForPublic(page = 1, limit = 10, search = ''): Promise<any> {
    const offset = (page - 1) * limit;
    let query = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .where('blog.isPublished = :isPublished', { isPublished: true });

    if (search) {
      query = query.andWhere('blog.title like :search', {
        search: `%${search}%`,
      });
    }

    const [results, count] = await query
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      page,
      limit,
      count,
      results,
    };
  }
}
