import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FriendsRoutingModule} from './friends-routing.module';
import {FriendsPageComponent} from './pages/friends-page/friends-page.component';

@NgModule({
  declarations: [
    FriendsPageComponent
  ],
  imports: [
    CommonModule,
    FriendsRoutingModule
  ]
})
export class FriendsModule {
}
