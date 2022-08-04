import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  filter,
  iif,
  mergeMap,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {Friend} from '../../models/friends.types';
import {ActivatedRoute, Router} from '@angular/router';
import {FriendsService} from '../../services/friends.service';
import {FormBuilder, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

const defaultEmptyFriend: Friend = {
  id: '',
  name: '',
  age: 0,
  weight: 0,
  friendIds: [],
};

@Component({
  selector: 'app-friend-edit',
  templateUrl: './friend-edit.component.html',
  styleUrls: ['./friend-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendEditComponent implements OnInit {
  protected readonly MIN_AGE = 0;
  protected readonly MAX_AGE = 150;
  protected readonly MIN_WEIGHT = 0;
  protected readonly MAX_WEIGHT = 500;

  protected editFriendForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    age: [
      '',
      [
        Validators.required,
        Validators.min(this.MIN_AGE),
        Validators.max(this.MAX_AGE),
      ],
    ],
    weight: [
      '',
      [
        Validators.required,
        Validators.min(this.MIN_WEIGHT),
        Validators.max(this.MAX_WEIGHT),
      ],
    ],
  });

  protected friend$: Observable<any> = this.route.params.pipe(
      switchMap(({id}) =>
          iif(
              () => !!id,
              this.friendsService.getFriendById$(id),
              of(defaultEmptyFriend)
          )
      ),
      catchError(error =>
          of(error).pipe(
              tap(() => this.router.navigate(['friends'])),
              map(() => null)
          )
      ),
      tap(friend => console.log('Paso2 con ', friend))
  );

  protected children$: Observable<Friend[]> = this.friend$.pipe(
      switchMap((friend: Friend) => this.friendsService.getChildren$(friend))
  );

  protected availableFriends$: Observable<Friend[]> = combineLatest([
    this.friend$.pipe(take(1)),
    this.friendsService.getFriendsList$(),
    this.children$,
  ]).pipe(
      map(([curFriend, allFriends, curChildren]) =>
          allFriends.filter(
              (item: Friend) =>
                  item.id !== curFriend.id &&
                  !curChildren.some((child: Friend) => child.id === item.id)
          )
      )
  );

  protected _isSpinnerVisibleSubject = new BehaviorSubject<boolean>(false);
  protected isSpinnerVisible$ = this._isSpinnerVisibleSubject.asObservable();

  // TODO: properly translate (return translation keys to the template)
  protected tittle: Observable<string> = this.friend$.pipe(
      map(({id}) => (!!id ? 'Edit' : 'Add'))
  );

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
            filter(({id}) => !!id),
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

    if (!this.editFriendForm.valid) {
      this.editFriendForm.markAllAsTouched();
      return;
    }

    this._isSpinnerVisibleSubject.next(true);
    this.editFriendForm.disable();

    this.friend$
        .pipe(
            take(1),
            map((friend: Friend) => this.convertFriendFormDataToModel(friend)),
            tap(friend => console.log('Paso3 con ', friend, !!friend?.id)),
            mergeMap((friend: Friend) =>
                !!friend?.id
                    ? this.friendsService.updateFriend$(friend)
                    : this.friendsService.addFriend$(friend)
            ),
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
    this.friend$
        .pipe(
            tap(v => console.log('Entro con ', v)),
            take(1),
            tap(({id}) =>
                !!id
                    ? this.router.navigate(['friends', 'details', id])
                    : this.router.navigate(['friends'])
            )
        )
        .subscribe();
  }
}
