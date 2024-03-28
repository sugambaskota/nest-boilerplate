import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { IPagination } from 'src/types/pagination';

export const GetPagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IPagination => {
    const req: Request = ctx.switchToHttp().getRequest();

    const paginationParams: IPagination = {
      page: 1,
      limit: 10,
      search: req.query?.search?.toString() || '',
    };

    const candidatePage = req.query?.page
      ? parseInt(req.query.page.toString())
      : null;
    const candidateLimit = req.query?.limit
      ? parseInt(req.query.limit.toString())
      : null;

    if (candidatePage && candidatePage > 0) {
      paginationParams.page = candidatePage;
    }

    if (candidateLimit && candidateLimit > 0 && candidateLimit <= 100) {
      paginationParams.limit = candidateLimit;
    }

    return paginationParams;
  },
);
