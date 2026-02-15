import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { AppLayout } from './layout';
import { WorklistPage } from '../features/worklist/ui/WorklistPage';
import { WorkItemDetailPage } from '../features/workItemDetail/ui/WorkItemDetailPage';
import { DomainObjectPage } from '../features/domainObject/ui/DomainObjectPage';

const rootRoute = createRootRoute({ component: AppLayout });

const worklistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: WorklistPage,
});

const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/work-items/$id',
  component: WorkItemDetailPage,
});

const objectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/objects/$objectType/$objectId',
  component: DomainObjectPage,
});

const routeTree = rootRoute.addChildren([worklistRoute, detailRoute, objectRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
