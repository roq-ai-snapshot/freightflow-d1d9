import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { supplierValidationSchema } from 'validationSchema/suppliers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getSuppliers();
    case 'POST':
      return createSupplier();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSuppliers() {
    const data = await prisma.supplier
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'supplier'));
    return res.status(200).json(data);
  }

  async function createSupplier() {
    await supplierValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.order?.length > 0) {
      const create_order = body.order;
      body.order = {
        create: create_order,
      };
    } else {
      delete body.order;
    }
    const data = await prisma.supplier.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
