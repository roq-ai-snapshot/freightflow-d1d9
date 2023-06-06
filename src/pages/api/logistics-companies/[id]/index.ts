import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { logisticsCompanyValidationSchema } from 'validationSchema/logistics-companies';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.logistics_company
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getLogisticsCompanyById();
    case 'PUT':
      return updateLogisticsCompanyById();
    case 'DELETE':
      return deleteLogisticsCompanyById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getLogisticsCompanyById() {
    const data = await prisma.logistics_company.findFirst(convertQueryToPrismaUtil(req.query, 'logistics_company'));
    return res.status(200).json(data);
  }

  async function updateLogisticsCompanyById() {
    await logisticsCompanyValidationSchema.validate(req.body);
    const data = await prisma.logistics_company.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteLogisticsCompanyById() {
    const data = await prisma.logistics_company.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
