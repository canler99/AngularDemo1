import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, filter, Observable, of, switchMap, take, tap,} from 'rxjs';
import {Friend} from '../../models/friends.types';
import {ActivatedRoute, Router} from '@angular/router';
import {FriendsService} from '../../services/friends.service';
import {FormBuilder, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-friend-edit',
  templateUrl: './friend-edit.component.html',
  styleUrls: ['./friend-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendEditComponent implements OnInit {
  protected friend$: Observable<any> = this.route.params.pipe(
      filter(({id}) => !!id),
      switchMap(({id}) => this.friendsService.getFriendById$(id)),
      tap(friend => console.log('Paso con ', friend))
  );

  protected _isSpinnerVisibleSubject = new BehaviorSubject<boolean>(false);
  protected isSpinnerVisible$ = this._isSpinnerVisibleSubject.asObservable();

  protected editFriendForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    age: ['0', [Validators.required]],
    weight: ['0', [Validators.required]],
  });

  constructor(
      private readonly router: Router,
      private readonly route: ActivatedRoute,
      private readonly formBuilder: FormBuilder,
      private readonly friendsService: FriendsService,
      private readonly snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.friend$
        .pipe(
            take(1),
            tap(friend => this.updateFriendFormDataFromModel(friend)),
            catchError(error =>
                of(error).pipe(
                    tap(() => this.router.navigate(['friends'])),
                    map(() => null)
                )
            )
        )
        .subscribe();
  }

  updateFriendFormDataFromModel(friend: Friend) {
    if (!friend) {
      throw {code: '004', description: 'Trying to update a null friend.'};
    }

    this.editFriendForm.setValue({
      name: friend.name,
      age: friend.age.toString(),
      weight: friend.weight.toString(),
    });
  }

  convertFriendFormDataToModel(friend: Friend): Friend {
    const formValue = this.editFriendForm.value;

    return {
      ...friend,
      name: formValue.name ?? '',
      age: +(formValue.age ?? 0),
      weight: +(formValue.weight ?? 0),
    };
  }

  onSubmit() {
    // check if form have not been modified, just go back
    if (!this.editFriendForm.dirty) {
      this.navigateBack();
    }

    this._isSpinnerVisibleSubject.next(true);
    this.editFriendForm.disable();

    this.friend$
        .pipe(
            take(1),
            map((friend: Friend) => this.convertFriendFormDataToModel(friend)),
            switchMap((friend: Friend) => this.friendsService.updateFriend(friend)),
            tap(() => {
              this._isSpinnerVisibleSubject.next(false);
              this.snackBar.open('Friend was updated successfully!', undefined, {
                duration: 3000,
              });
              this.navigateBack();
            }),
            catchError(error =>
                of(error).pipe(
                    // Better way could be displaying a user-friendly error message in an error banner at the top of the form
                    tap(({code, description}) => {
                      this.snackBar.open(
                          `Error updating: ${code}:${description}`,
                          'DISMISS'
                      );
                      this._isSpinnerVisibleSubject.next(false);
                      this.editFriendForm.enable();
                    })
                )
            )
        )
        .subscribe();
  }

  closeBtnClicked() {
    this.navigateBack();
  }

  navigateBack() {
    this.friend$.pipe(take(1)).subscribe((friend: Friend) => {
      this.router.navigate(['friends', 'details', friend?.id]);
    });
  }
}
