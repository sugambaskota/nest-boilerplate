import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetPagination } from 'src/decorators/get-pagination';
import { IPagination } from 'src/types/pagination';
import { User } from 'src/users/user.entity';
import { UserRoles } from 'src/users/user.roles';
import { Blog } from './blog.entity';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { PatchBlogDto } from './dto/patch-blog.dto';

@Controller()
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Post('blogs')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([UserRoles.SUPER_ADMIN])
  createBlog(
    @Body()
    createBlogDto: CreateBlogDto,
    @GetUser()
    user: User,
  ): Promise<Blog> {
    return this.blogsService.createBlog(createBlogDto, user);
  }

  @Put('blogs/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([UserRoles.SUPER_ADMIN])
  updateBlog(
    @Param('id')
    id: string,
    @Body()
    createBlogDto: CreateBlogDto,
  ): Promise<Blog> {
    return this.blogsService.updateBlog(id, createBlogDto);
  }

  @Patch('blogs/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([UserRoles.SUPER_ADMIN])
  patchBlog(
    @Param('id')
    id: string,
    @Body()
    patchBlogDto: PatchBlogDto,
  ): Promise<Blog> {
    return this.blogsService.patchBlog(id, patchBlogDto);
  }

  @Delete('blogs/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([UserRoles.SUPER_ADMIN])
  deleteBlog(@Param('id') id: string): Promise<any> {
    return this.blogsService.deleteBlog(id);
  }

  @Get('blogs/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([UserRoles.SUPER_ADMIN])
  getBlog(@Param('id') id: string): Promise<Blog> {
    return this.blogsService.getBlog(id);
  }

  @Get('blogs')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([UserRoles.SUPER_ADMIN])
  getBlogs(
    @GetPagination()
    pagination: IPagination,
  ): Promise<any> {
    const { page, limit, search } = pagination;

    return this.blogsService.getBlogs(page, limit, search);
  }

  @Get('blog/:slug')
  getBlogForPublic(
    @Param('slug')
    slug: string,
  ): Promise<any> {
    return this.blogsService.getBlogForPublic(slug);
  }

  @Get('blog')
  getBlogsForPublic(
    @GetPagination()
    pagination: IPagination,
  ): Promise<any> {
    const { page, limit, search } = pagination;

    return this.blogsService.getBlogsForPublic(page, limit, search);
  }
}
