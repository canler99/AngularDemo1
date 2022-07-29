import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FriendsRoutingModule} from './friends-routing.module';
import {FriendsPageComponent} from './pages/friends-page/friends-page.component';
import {FriendsListComponent} from './containers/friends-list/friends-list.component';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {friendsReducer} from './store/reducers/friends.reducers';
import {FriendsEffects} from './store/effects/friends.effects';
import {friendsFeatureKey} from './store/friends-store.types';
import {MaterialCommonModule} from '../../material.module';

@NgModule({
  declarations: [
    FriendsPageComponent,
    FriendsListComponent
  ],
  imports: [
    CommonModule,
    MaterialCommonModule,
    FriendsRoutingModule,
    StoreModule.forFeature(friendsFeatureKey, friendsReducer),
    EffectsModule.forFeature([FriendsEffects])
  ]
})
export class FriendsModule {
}
