import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent, title: 'Home',},
  {path: 'settings', component: SettingsPageComponent, title: 'Settings',},
  {path: 'friends', loadChildren: () => import('./features/friends/friends.module').then(m => m.FriendsModule)},
  //{ path: '',   redirectTo: '/home', pathMatch: 'full' },
  {path: '**', component: NotFoundPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
