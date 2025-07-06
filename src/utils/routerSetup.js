// utils/routerSetup.js
// Berisi fungsi setupMainRoutes dan setupIntroRoutes untuk modularisasi routing

import { ROUTES } from './routes.js';

export function setupMainRoutes(appInstance) {
  const appRouter = appInstance.router;
  appRouter.addRoute(ROUTES.DASHBOARD, () => appInstance.showDashboard());
  appRouter.addRoute(ROUTES.PRACTICE, () => appInstance.showPractice());
  appRouter.addRoute(ROUTES.PROFILE, () => appInstance.showProfile());
  appRouter.addRoute(ROUTES.CATEGORIES_DYNAMIC, (params) => appInstance.showCategory(params));
  // Tambahkan route untuk /practice/:categoryId agar klik card kategori tidak error
  appRouter.addRoute('/practice/:categoryId', (params) => appInstance.showCategory(params));
  appRouter.addRoute(ROUTES.PRACTICE_DYNAMIC, (params) => appInstance.showPractice(params));
  appRouter.addRoute(ROUTES.PRACTICE_RESULT_DYNAMIC, (params) => appInstance.showPracticeResult(params));
  appRouter.addRoute('/', () => {
    if (appInstance.checkIntroToken()) {
      appInstance.showDashboardDirect();
    } else if (appInstance.introRouter) {
      window.location.hash = '/welcome';
    }
  });
  appRouter.addRoute('*', () => {
    console.warn('AppRouter: No route matched for:', window.location.pathname);
    appInstance.showError('Halaman tidak ditemukan');
  });
}

export function setupIntroRoutes(appInstance) {
  const introRouter = appInstance.introRouter;
  introRouter.addRoute('/', () => appInstance._handleRootPath());
  const introRoutes = [
    { path: '/welcome', handler: () => appInstance.showWelcome() },
    { path: '/test', handler: () => appInstance.showTest() },
    { path: '/result', handler: () => appInstance.showResult() },
    { path: '/splash', handler: () => appInstance.showSplash() }
  ];
  introRoutes.forEach(route => {
    introRouter.addRoute(route.path, () => {
      if (!appInstance._checkAndRedirectToDashboard()) {
        route.handler();
      }
    });
  });
  introRouter.addRoute('/dashboard', () => {
    appInstance.setIntroToken();
    appInstance.showDashboardDirect();
  });
  introRouter.addRoute('*', () => {
    if (!appInstance._checkAndRedirectToDashboard() && window.location.hash !== '#/welcome') {
      window.location.hash = '/welcome';
    }
  });
}
