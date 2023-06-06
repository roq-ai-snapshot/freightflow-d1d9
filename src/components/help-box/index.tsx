import React from 'react';
import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Text,
  UnorderedList,
  ListItem,
  Link,
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';
import { useSession } from '@roq/nextjs';

export const HelpBox: React.FC = () => {
  const ownerRoles = ['Logistics Company Owner'];
  const roles = [
    'Logistics Company Owner',
    'Supply Chain Manager',
    'Warehouse Supervisor',
    'Admin',
    'Supplier',
    'Customer',
  ];
  const applicationName = 'FreightFlow';
  const tenantName = 'Logistics Company';
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;
  const userStories = `Logistics Company Owner:
1. As a logistics company owner, I want to be able to view the overall performance of my company, including shipment tracking, route optimization, and warehouse inventory management, so that I can make informed decisions about my business.
2. As a logistics company owner, I want to be able to add and manage users (supply chain managers, warehouse supervisors, and admins) within my company, so that I can delegate tasks and responsibilities.
3. As a logistics company owner, I want to receive notifications about any issues or delays in the supply chain, so that I can address them promptly and maintain customer satisfaction.
4. As a logistics company owner, I want to be able to view and analyze historical data on shipments, routes, and inventory, so that I can identify trends and areas for improvement.

Supply Chain Manager:
1. As a supply chain manager, I want to be able to optimize routes for shipments, so that we can reduce transportation costs and improve delivery times.
2. As a supply chain manager, I want to be able to track shipments in real-time, so that I can provide accurate updates to customers and address any issues that arise.
3. As a supply chain manager, I want to be able to manage relationships with suppliers, so that I can ensure a steady flow of goods and maintain inventory levels.
4. As a supply chain manager, I want to be able to generate reports on supply chain performance, so that I can share insights with the logistics company owner and other team members.

Warehouse Supervisor:
1. As a warehouse supervisor, I want to be able to manage warehouse inventory, including receiving, storing, and shipping goods, so that we can fulfill customer orders efficiently.
2. As a warehouse supervisor, I want to be able to track inventory levels in real-time, so that I can prevent stockouts and overstocking.
3. As a warehouse supervisor, I want to be able to assign tasks to warehouse staff, so that I can ensure efficient operations and maintain a well-organized warehouse.

Admin:
1. As an admin, I want to be able to manage user accounts and permissions, so that I can ensure the right people have access to the appropriate tools and information.
2. As an admin, I want to be able to configure system settings, such as notifications and integrations, so that the platform meets the needs of our logistics company.
3. As an admin, I want to be able to provide technical support to other users, so that they can effectively use the platform and resolve any issues that arise.

Supplier:
1. As a supplier, I want to be able to view and manage my orders from the logistics company, so that I can ensure timely delivery of goods.
2. As a supplier, I want to be able to communicate with the logistics company through the platform, so that I can address any questions or concerns.
3. As a supplier, I want to be able to view my performance metrics, such as on-time delivery rates and order accuracy, so that I can identify areas for improvement and maintain a strong relationship with the logistics company.

Customer:
1. As a customer, I want to be able to track my shipments in real-time, so that I can stay informed about the status of my orders.
2. As a customer, I want to be able to communicate with the logistics company through the platform, so that I can ask questions or report any issues with my shipments.
3. As a customer, I want to be able to view my order history and any related documents, such as invoices and packing slips, so that I can easily manage my purchases and maintain accurate records.`;

  const { session } = useSession();
  if (!process.env.NEXT_PUBLIC_SHOW_BRIEFING || process.env.NEXT_PUBLIC_SHOW_BRIEFING === 'false') {
    return null;
  }
  return (
    <Box width={1} position="fixed" left="20px" bottom="20px" zIndex={3}>
      <Popover placement="top">
        <PopoverTrigger>
          <IconButton
            aria-label="Help Info"
            icon={<FiInfo />}
            bg="blue.800"
            color="white"
            _hover={{ bg: 'blue.800' }}
            _active={{ bg: 'blue.800' }}
            _focus={{ bg: 'blue.800' }}
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>App Briefing</PopoverHeader>
          <PopoverBody maxH="400px" overflowY="auto">
            <Text mb="2">Hi there!</Text>
            <Text mb="2">
              Welcome to {applicationName}, your freshly generated B2B SaaS application. This in-app briefing will guide
              you through your application. Feel free to remove this tutorial with the{' '}
              <Box as="span" bg="yellow.300" p={1}>
                NEXT_PUBLIC_SHOW_BRIEFING
              </Box>{' '}
              environment variable.
            </Text>
            <Text mb="2">You can use {applicationName} with one of these roles:</Text>
            <UnorderedList mb="2">
              {roles.map((role) => (
                <ListItem key={role}>{role}</ListItem>
              ))}
            </UnorderedList>
            {session?.roqUserId ? (
              <Text mb="2">You are currently logged in as a {session?.user?.roles?.join(', ')}.</Text>
            ) : (
              <Text mb="2">
                Right now, you are not logged in. The best way to start your journey is by signing up as{' '}
                {ownerRoles.join(', ')} and to create your first {tenantName}.
              </Text>
            )}
            <Text mb="2">
              {applicationName} was generated based on these user stories. Feel free to try them out yourself!
            </Text>
            <Box mb="2" whiteSpace="pre-wrap">
              {userStories}
            </Box>
            <Text mb="2">
              If you are happy with the results, then you can get the entire source code here:{' '}
              <Link href={githubUrl} color="cyan.500" isExternal>
                {githubUrl}
              </Link>
            </Text>
            <Text mb="2">
              Console Dashboard: For configuration and customization options, access our console dashboard. Your project
              has already been created and is waiting for your input. Check your emails for the invite.
            </Text>
            <Text mb="2">
              <Link href="https://console.roq.tech" color="cyan.500" isExternal>
                ROQ Console
              </Link>
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
