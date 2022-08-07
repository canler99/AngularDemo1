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
import {FriendDetailsComponent} from './components/friend-details/friend-details.component';
import {FriendEditComponent} from './components/friend-edit/friend-edit.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ConfirmationDialogComponent} from './components/confirmation-dialog/confirmation-dialog.component';
import {D3GraphicComponent} from './components/d3-graphic/d3-graphic.component';

@NgModule({
  declarations: [
    FriendsPageComponent,
    FriendsListComponent,
    FriendDetailsComponent,
    FriendEditComponent,
    ConfirmationDialogComponent,
    D3GraphicComponent,
  ],
  imports: [
    CommonModule,
    MaterialCommonModule,
    FriendsRoutingModule,
    StoreModule.forFeature(friendsFeatureKey, friendsReducer),
    EffectsModule.forFeature([FriendsEffects]),
    ReactiveFormsModule,
  ],
})
export class FriendsModule {
}
