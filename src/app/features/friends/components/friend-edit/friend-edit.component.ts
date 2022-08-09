import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  filter,
  merge,
  mergeMap,
  Observable,
  of,
  scan,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {Friend} from '../../models/friends.types';
import {ActivatedRoute, Router} from '@angular/router';
import {FriendsService} from '../../services/friends.service';
import {FormBuilder, Validators} from '@angular/forms';
import {map, shareReplay} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {defaultEmptyFriend} from '../../models/friends.mocks';

/**
 * Command structure to be used when handling add, delete, list events
 */
interface Command {
  cmd: 'add' | 'delete' | 'list';
  payload: Friend | Friend[];
}

@Component({
  selector: 'app-friend-edit',
  templateUrl: './friend-edit.component.html',
  styleUrls: ['./friend-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendEditComponent implements OnInit {
  /**
   * Retrieves the existing friend object to be edited from the id obtained from the route.
   * Generates a new default friend object if no id was provided.
   */
  public friend$: Observable<any> = this.route.params.pipe(
      switchMap(({id}) =>
          !!id ? this.friendsService.getFriendById$(id) : of(defaultEmptyFriend)
      ),
      catchError(error =>
          of(error).pipe(
              tap(v => console.log('Entro5 con: ERROR 5', v)),
              tap(() => this.router.navigate(['friends'])),
              map(() => null)
          )
      )
  );

  /**
   * Generates the form title depending on weather we re editing a new or existing friend
   * @todo: properly translate (return translation keys to the template)
   */
  public tittle$: Observable<string> = this.friend$.pipe(
      map((friend: Friend) => (!!friend?.id ? 'Edit' : 'Add'))
  );

  protected readonly MIN_AGE = 0;
  protected readonly MAX_AGE = 150;
  protected readonly MIN_WEIGHT = 0;
  protected readonly MAX_WEIGHT = 500;

  /**
   * Angular reactive form instance used by this component
   * @protected
   */
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
  /**
   * Add friend event
   * @protected
   */
  protected addChildSubject = new Subject<Command>();
  /**
   * Delete friend event
   * @protected
   */
  protected deleteChildSubject = new Subject<Command>();
  /**
   * Controls when the form's spinner should be displayed
   * @protected
   */
  protected _isFormSpinnerVisibleSubject = new BehaviorSubject<boolean>(false);
  /**
   * Keeps an in memory copy of the children (friends) of the current friend.
   * Responds to command to initialize (list), add or delete friends to that list.
   * @protected
   */
  public children$: Observable<Friend[]> = merge(
      this.friend$.pipe(
          take(1),
          filter((friend: Friend) => !!friend),
          switchMap((friend: Friend) =>
              !!friend && !!friend?.id
                  ? this.friendsService.getChildren$(friend)
                  : of([])
          ),
          map((friends: Friend[]) => ({cmd: 'list', payload: friends} as Command))
      ),
      this.addChildSubject,
      this.deleteChildSubject
  ).pipe(
      tap((command: Command) => {
        command?.cmd !== 'list' && this.editFriendForm.markAsDirty();
        this._isLeftListSpinnerVisibleSubject.next(false);
      }),
      scan(
          (acc: Friend[], value: Command): Friend[] =>
              this.applyCommandToChildrenList(value, acc),
          []
      ),
      map((v: Friend[]) => v),
      shareReplay(1)
  );
  /**
   * Controls when the left list's spinner should be displayed
   * @private
   */
  private _isLeftListSpinnerVisibleSubject = new BehaviorSubject<boolean>(true);
  /**
   * List of all available friends to connect with the current one. Filters out
   *  the current friend, and friends of the current friend
   * @protected
   */
  public availableFriends$: Observable<Friend[]> = combineLatest([
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
      ),
      tap(() => this._isRightListSpinnerVisible.next(false)),
      catchError(error =>
          of(error).pipe(
              tap(v => console.log('Entro ' + '112 con:ERROR 112')),
              tap(({code, description}) => {
                this._isRightListSpinnerVisible.next(false);
                this.snackBar.open(
                    `Error retrieving available friends: ${code}:${description}`,
                    'DISMISS'
                );
              }),
              map(() => [])
          )
      )
  );
  protected isFormSpinnerVisible$ =
      this._isFormSpinnerVisibleSubject.asObservable();
  /**
   * Controls when the right list's spinner should be displayed
   * @private
   */
  private _isRightListSpinnerVisible = new BehaviorSubject<boolean>(true);
  protected isLeftListSpinnerVisible$ =
      this._isLeftListSpinnerVisibleSubject.asObservable();
  protected isRightListSpinnerVisible$ =
      this._isRightListSpinnerVisible.asObservable();

  constructor(
      private readonly router: Router,
      private readonly route: ActivatedRoute,
      private readonly formBuilder: FormBuilder,
      private readonly friendsService: FriendsService,
      private readonly snackBar: MatSnackBar
  ) {
  }

  /**
   * During initialization, if we are editing an existing friend, we convert the model to Form data
   * If there is an error we navigate back to the friend list page.
   */
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

  /**
   * Updates the form with the data from the current model object
   * @param friend Current object being edited
   */
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

  /**
   * Converts the data stored in the form, to a Friend model object.
   * @param friend Used to get the id of the current object since that field it is not kept in the form
   * @returns Observable<Friend> generated friend object observable
   */
  convertFriendFormDataToModel(friend: Friend): Observable<Friend> {
    const formValue = this.editFriendForm.value;

    return this.children$.pipe(
        take(1),
        map((children: Friend[]) => ({
          ...friend,
          name: formValue.name ?? '',
          age: +(formValue.age ?? 0),
          weight: +(formValue.weight ?? 0),
          friendIds: children.map((child: Friend) => child.id),
        }))
    );
  }

  /**
   * Handles form submission.
   */
  onSubmit() {
    // check if form have not been modified, just go back
    if (!this.editFriendForm.dirty) {
      this.navigateBack();
    }

    if (!this.editFriendForm.valid) {
      this.editFriendForm.markAllAsTouched();
      return;
    }

    this._isFormSpinnerVisibleSubject.next(true);
    this.editFriendForm.disable();

    this.friend$
        .pipe(
            take(1),
            switchMap((friend: Friend) =>
                this.convertFriendFormDataToModel(friend)
            ),
            mergeMap((friend: Friend) =>
                !!friend?.id
                    ? this.friendsService.updateFriend$(friend)
                    : this.friendsService.addFriend$(friend)
            ),
            tap((friend: Friend) => {
              this._isFormSpinnerVisibleSubject.next(false);
              this.snackBar.open('Changes were successfully saved!', undefined, {
                duration: 3000,
              });
              this.navigateBack(friend);
            }),
            catchError(error =>
                of(error).pipe(
                    // Better way could be displaying a user-friendly error message in an error banner at the top
                    // of the form
                    tap(({code, description}) => {
                      this.snackBar.open(
                          `Error updating: ${code}:${description}`,
                          'DISMISS'
                      );
                      this._isFormSpinnerVisibleSubject.next(false);
                      this.editFriendForm.enable();
                    })
                )
            )
        )
        .subscribe();
  }

  /**
   * Handles the close button close event
   */
  closeBtnClicked() {
    this.navigateBack();
  }

  /**
   * Navigates to the previous page which will be the list page in Add mode,
   * or the details page on Edit mode.
   */
  navigateBack(friend?: Friend) {
    this.friend$
        .pipe(
            take(1),
            tap(({id}) =>
                !!id || !!friend?.id
                    ? this.router.navigate(['friends', 'details', id || friend?.id])
                    : this.router.navigate(['friends'])
            )
        )
        .subscribe();
  }

  /**
   * Handles the leftRemoveChildBtnClicked event, to delete child.
   * @param friend: Child to delete
   */
  leftRemoveChildBtnClicked(friend: Friend) {
    this.deleteChildSubject.next({cmd: 'delete', payload: friend});
  }

  /**
   * Handles the rightDeleteChildBtnClicked event, to add an available friend to children list.
   * @param friend: Friend to add
   */
  rightDeleteChildBtnClicked(friend: Friend) {
    this.addChildSubject.next({cmd: 'add', payload: friend});
  }

  /**
   * Updateds by applying a command to the list of children of the current friend.
   * @param cmd Command to apply. Possible commands are: add, delete, list
   * @param childrenList
   * @private
   */
  private applyCommandToChildrenList(
      cmd: Command,
      childrenList: Friend[]
  ): Friend[] {
    switch (cmd.cmd) {
      case 'add':
        childrenList.push(cmd.payload as Friend);
        break;
      case 'delete':
        const index = (childrenList as Friend[]).findIndex(
            (friend: Friend) => friend.id === (cmd?.payload as Friend)?.id
        );
        if (index > -1) {
          (childrenList as Friend[]).splice(index, 1);
        }
        break;
      case 'list':
        childrenList = cmd.payload as Friend[];
    }
    return [...childrenList];
  }
}
