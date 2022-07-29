import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FriendsPageComponent} from './pages/friends-page/friends-page.component';

const routes: Routes = [{path: '', component: FriendsPageComponent, title: 'FriendsApp | Friends'}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FriendsRoutingModule {
}
