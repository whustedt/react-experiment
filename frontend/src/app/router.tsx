import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from '@tanstack/react-router';
import { AppShell } from './AppShell';

const rootRoute = createRootRoute({
  component: AppShell,
});

const worklistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazyRouteComponent(() => import('../features/worklist/ui/WorklistPage')),
});

const workItemDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/work-items/$id',
  component: lazyRouteComponent(() => import('../features/workItemDetail/ui/WorkItemDetailPage')),
});

const routeTree = rootRoute.addChildren([worklistRoute, workItemDetailRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
