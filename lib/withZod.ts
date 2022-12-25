import { NextApiRequest, NextApiResponse } from 'next';
import { z, ZodSchema } from 'zod';

const withZod = <T extends ZodSchema>(
  schema: T,
  next: (
    req: NextApiRequest & z.infer<T>,
    res: NextApiResponse,
  ) => unknown | Promise<unknown>,
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const parsed = schema.safeParse(req);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Bad Request',
      });
      return;
    }

    return next(req, res);
  };
};

export default withZod;
