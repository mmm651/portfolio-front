import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';
import { Home } from './layout/home/home';
import { Contact } from './layout/contact/contact';
import { About } from './layout/about/about';
import { OurServices } from './layout/ourservices/ourservices';
import { OurClients } from './layout/our-clients/our-clients';
import { NotFound } from './shared/not-found/not-found';
import { Dashboard } from './dashboard/dashboard/dashboard';
import { DashboardHome } from './dashboard/home/home';
import { DashboardBrand } from './dashboard/brand/brand';
import { DashboardContact} from './dashboard/contact/contact';
import {  DashboardAbout } from './dashboard/about/about';
import { DashboardOurServices} from './dashboard/our-services/our-services';
import { DashboardOurClients} from './dashboard/our-clients/our-clients';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'contact', component: Contact },
      { path: 'about', component: About },
      { path: 'services', component: OurServices },
      { path: 'clients', component: OurClients },
    ],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHome },
      { path: 'brand', component: DashboardBrand },
      { path: 'contact', component: DashboardContact },
      { path: 'about', component: DashboardAbout },
      { path: 'our-services', component: DashboardOurServices },
      { path: 'our-clients', component: DashboardOurClients },
    ],
  },
  { path: '**', component: NotFound },
];
