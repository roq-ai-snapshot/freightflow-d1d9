import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { shipmentValidationSchema } from 'validationSchema/shipments';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.shipment
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getShipmentById();
    case 'PUT':
      return updateShipmentById();
    case 'DELETE':
      return deleteShipmentById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getShipmentById() {
    const data = await prisma.shipment.findFirst(convertQueryToPrismaUtil(req.query, 'shipment'));
    return res.status(200).json(data);
  }

  async function updateShipmentById() {
    await shipmentValidationSchema.validate(req.body);
    const data = await prisma.shipment.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteShipmentById() {
    const data = await prisma.shipment.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
