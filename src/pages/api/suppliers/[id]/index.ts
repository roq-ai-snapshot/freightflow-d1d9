import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { supplierValidationSchema } from 'validationSchema/suppliers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.supplier
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSupplierById();
    case 'PUT':
      return updateSupplierById();
    case 'DELETE':
      return deleteSupplierById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSupplierById() {
    const data = await prisma.supplier.findFirst(convertQueryToPrismaUtil(req.query, 'supplier'));
    return res.status(200).json(data);
  }

  async function updateSupplierById() {
    await supplierValidationSchema.validate(req.body);
    const data = await prisma.supplier.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteSupplierById() {
    const data = await prisma.supplier.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
