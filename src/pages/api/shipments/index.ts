import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { shipmentValidationSchema } from 'validationSchema/shipments';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getShipments();
    case 'POST':
      return createShipment();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getShipments() {
    const data = await prisma.shipment
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'shipment'));
    return res.status(200).json(data);
  }

  async function createShipment() {
    await shipmentValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.shipment.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
