import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { Seasonals } from './pages/seasonals/seasonals';
import { MALAuthCallback } from '@app/pages/mal-auth-callback/mal-auth-callback';
import { UserComponent } from '@app/pages/user/user';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'seasonals', component: Seasonals },
      { path: 'mal-auth/callback', component: MALAuthCallback  },
      { path: 'user', component: UserComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
