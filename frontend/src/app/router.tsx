import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { DomainObjectDetailPage } from '../features/domainObjectDetail/ui/DomainObjectDetailPage';
import { WorkItemDetailPage } from '../features/workItemDetail/ui/WorkItemDetailPage';
import { WorklistPage } from '../features/worklist/ui/WorklistPage';
import { ErrorFallback } from './ErrorFallback';
import { AppLayout } from './layout';

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

export const router = createRouter({
  routeTree,
  defaultErrorComponent: ({ error, reset }) => (
    <ErrorFallback message={error.message || 'Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.'} onAction={reset} />
  ),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
