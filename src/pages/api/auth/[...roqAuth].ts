import { RoqAuth } from '@roq/nextjs';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';

/*
    You can export RoqAuth without passing any options if you don't need to customize the behaviour
    export default RoqAuth; //handles all the authentication routes automatically
*/

export default RoqAuth({
  hooks: {
    // This hook is optional - and can be used to persist user information,
    // or as in the case below, send them a welcome notification

    onRegisterSuccess: async ({ user }) => {
      roqClient.asSuperAdmin().notify({
        notification: {
          key: 'welcome',
          recipients: { userIds: [user.id] },
        },
      });
      /* start register-handler */

      /* end register-handler */
    },

    onLoginSuccess: async ({ user }) => {
      const existedUser = await prisma.user.findFirst({ where: { roq_user_id: user.id } });
      if (!existedUser) {
        const owner = await prisma.user.create({
          data: {
            roq_user_id: user.id,
            tenant_id: user.tenantId,
            email: user.email,
          },
        });
      }
    },
  },
});
