import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { AppLayout } from './layout';
import { DomainObjectDetailPage } from '../features/domainObjectDetail/ui/DomainObjectDetailPage';
import { WorkItemDetailPage } from '../features/workItemDetail/ui/WorkItemDetailPage';
import { WorklistPage } from '../features/worklist/ui/WorklistPage';

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

const domainObjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/objects/$objectType/$objectId',
  component: DomainObjectDetailPage,
});

const routeTree = rootRoute.addChildren([worklistRoute, detailRoute, domainObjectRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
