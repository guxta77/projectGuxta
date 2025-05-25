import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';  // importe o guard
import { PublicPageComponent } from './pages/public-page/public-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'pagina/:uid', component: PublicPageComponent },
];


