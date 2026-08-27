import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignupView from '../views/SignupView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ApprovalsView from '../views/ApprovalsView.vue'
import PlansView from '../views/PlansView.vue'
import UploadView from '../views/UploadView.vue'
import BinListView from '../views/BinListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/approvals',
      name: 'approvals',
      component: ApprovalsView,
    },
    {
      path: '/plans',
      name: 'plans',
      component: PlansView,
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadView,
    },
    {
      path: '/bin-list',
      name: 'bin-list',
      component: BinListView,
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/ReportsHubView.vue'),
    },
    {
      path: '/reports/duplicates',
      name: 'reports-duplicates',
      component: () => import('../views/DuplicateEntitiesReportView.vue'),
    },
    {
      path: '/reports/entity-details',
      name: 'entity-details-report',
      component: () => import('../views/EntityDetailsReportView.vue'),
    },
    {
      path: '/reports/entity-list',
      name: 'entity-list-report',
      component: () => import('../views/EntityListReportView.vue'),
    },
    {
      path: '/reports/entity-by-economic-activities',
      name: 'entity-by-economic-activities',
      component: () => import('../views/EntityByEconomicActivitiesReportView.vue'),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const titles: Record<string, string> = {
    'home': 'Home',
    'signup': 'Signup',
    'login': 'Login',
    'dashboard': 'Dashboard',
    'approvals': 'Approvals',
    'plans': 'Plans',
    'upload': 'Upload',
    'bin-list': 'BIN List',
    'reports': 'Reports Hub',
    'reports-duplicates': 'Duplicate BIN Report',
    'entity-details-report': 'Entity Details Report',
    'entity-list-report': 'Entity List Report',
    'entity-by-economic-activities': 'Entity by Economic Activities'
  };
  
  if (to.name && typeof to.name === 'string' && titles[to.name]) {
    document.title = `${titles[to.name]} | BIN Checker`;
  } else {
    document.title = 'BIN Checker';
  }
  
  // Bypass SSO and login redirects for local authentication
  // All routes are accessible directly.
  
  next();
});

export default router
