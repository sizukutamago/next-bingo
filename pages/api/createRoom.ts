// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import withZod from '../../lib/withZod';
import prisma from '../../lib/prisma';

const handlePost = withZod(
  z.object({
    body: z.object({ name: z.string() }),
  }),
  async (req, res) => {
    const { name } = req.body;
    const room = await prisma.room.create({
      data: {
        name,
      },
    });
    res.status(200).json(room);
  },
);

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return handlePost(req, res);
    default:
      res.status(405).json({ message: 'method not allowed' });
      return;
  }
};

export default handler;
