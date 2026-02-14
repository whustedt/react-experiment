import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { AppLayout } from './layout';
import { WorklistPage } from '../features/worklist/ui/WorklistPage';
import { WorkItemDetailPage } from '../features/workItemDetail/ui/WorkItemDetailPage';

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

const routeTree = rootRoute.addChildren([worklistRoute, detailRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
