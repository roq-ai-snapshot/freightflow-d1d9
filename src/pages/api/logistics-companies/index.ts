import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { logisticsCompanyValidationSchema } from 'validationSchema/logistics-companies';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getLogisticsCompanies();
    case 'POST':
      return createLogisticsCompany();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getLogisticsCompanies() {
    const data = await prisma.logistics_company
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'logistics_company'));
    return res.status(200).json(data);
  }

  async function createLogisticsCompany() {
    await logisticsCompanyValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.route?.length > 0) {
      const create_route = body.route;
      body.route = {
        create: create_route,
      };
    } else {
      delete body.route;
    }
    if (body?.shipment?.length > 0) {
      const create_shipment = body.shipment;
      body.shipment = {
        create: create_shipment,
      };
    } else {
      delete body.shipment;
    }
    if (body?.warehouse?.length > 0) {
      const create_warehouse = body.warehouse;
      body.warehouse = {
        create: create_warehouse,
      };
    } else {
      delete body.warehouse;
    }
    const data = await prisma.logistics_company.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
