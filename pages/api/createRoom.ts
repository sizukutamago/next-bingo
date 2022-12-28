// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import withZod from '../../lib/withZod';
import prisma from '../../lib/prisma';
import bcrypt from 'bcrypt';
import { setCookie } from 'nookies';

const handlePost = withZod(
  z.object({
    body: z.object({ name: z.string() }),
  }),
  async (req, res) => {
    const { name } = req.body;
    const salt = bcrypt.genSaltSync(10);

    const room = await prisma.room.create({
      data: {
        name,
        hash: bcrypt.hashSync(name, salt),
      },
    });

    setCookie({ res }, 'next_bingo_room', room.hash, {
      maxAge: 30 * 24 * 60,
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      scure: process.env.NODE_ENV === 'production',
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
