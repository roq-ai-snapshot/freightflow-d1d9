import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { routeValidationSchema } from 'validationSchema/routes';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getRoutes();
    case 'POST':
      return createRoute();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRoutes() {
    const data = await prisma.route
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'route'));
    return res.status(200).json(data);
  }

  async function createRoute() {
    await routeValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.route.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
