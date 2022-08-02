import {ChangeDetectionStrategy, Component} from '@angular/core';
import {catchError, filter, Observable, of, switchMap, take, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {FriendsService} from '../../services/friends.service';
import {Friend} from '../../models/friends.types';
import {map} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.component.html',
  styleUrls: ['./friend-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendDetailsComponent {
  protected friend$: Observable<any> = this.route.params.pipe(
      filter(({id}) => !!id),
      switchMap(({id}) => this.friendsService.getFriendById$(id)),
      catchError(error =>
          of(error).pipe(
              tap(() => this.router.navigate(['friends'])),
              map(() => null)
          )
      )
  );

  constructor(
      private router: Router,
      private readonly route: ActivatedRoute,
      private readonly friendsService: FriendsService,
      private readonly dialog: MatDialog
  ) {
  }

  editFriendBtnClicked() {
    this.friend$.pipe(take(1)).subscribe((friend: Friend) => {
      this.router.navigate(['friends', 'edit', friend?.id]);
    });
  }

  openDialog(): void {
    this.dialog.open(ConfirmationDialogComponent);
  }

  navigateBack() {
    this.router.navigate(['friends']);
  }
}
