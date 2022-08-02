import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FriendsPageComponent} from './pages/friends-page/friends-page.component';
import {FriendDetailsComponent} from './components/friend-details/friend-details.component';
import {FriendEditComponent} from './components/friend-edit/friend-edit.component';

const routes: Routes = [
  {
    path: '',
    component: FriendsPageComponent,
    title: 'FriendsApp | Friends',
    children: [
      {
        path: 'details/:id',
        component: FriendDetailsComponent,
      },
      {
        path: 'edit/:id',
        component: FriendEditComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsRoutingModule {
}
