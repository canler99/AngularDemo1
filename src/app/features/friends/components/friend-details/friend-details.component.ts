import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, catchError, filter, Observable, of, switchMap, take, tap,} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {FriendsService} from '../../services/friends.service';
import {Friend} from '../../models/friends.types';
import {map, shareReplay} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-friend-details',
    templateUrl: './friend-details.component.html',
    styleUrls: ['./friend-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendDetailsComponent {
    private isChildrenLoadingSubject$ = new BehaviorSubject<boolean>(true);
    /**
     * Retrieves the existing friend object to display from the id obtained from the route
     * If no id was provided navigates back to the friend list page
     * @protected
     */
    protected friend$: Observable<any> = this.route.params.pipe(
        filter(({id}) => !!id),
        tap(() => this.isChildrenLoadingSubject$.next(true)),
        switchMap(({id}) => this.friendsService.getFriendById$(id)),
        catchError(error =>
            of(error).pipe(
                tap(() => this.router.navigate(['friends'])),
                map(() => null)
            )
        )
    );
    /**
     * Indicates when the children list is being loaded
     * @protected
     */
    protected isChildrenLoading$ = this.isChildrenLoadingSubject$.asObservable();
    /**
     * Friends (children) of the current friend
     * @protected
     */
    protected children$: Observable<Friend[]> = this.friend$.pipe(
        filter((friend: Friend) => !!friend),
        switchMap((friend: Friend) => this.friendsService.getChildren$(friend)),
        tap(() => this.isChildrenLoadingSubject$.next(false)),
        catchError(error =>
            of(error).pipe(
                map(() => []),
                tap(() => this.isChildrenLoadingSubject$.next(false))
            )
        ),
        shareReplay(1)
    );

    constructor(
        private router: Router,
        private readonly route: ActivatedRoute,
        private readonly friendsService: FriendsService,
        private readonly dialog: MatDialog,
        private readonly snackBar: MatSnackBar
    ) {
    }

    /**
     * When the edit button is clicked, we navigate to the edit page
     */
    editFriendBtnClicked() {
        this.friend$.pipe(take(1)).subscribe((friend: Friend) => {
            this.router.navigate(['friends', 'edit', friend?.id]).then();
        });
    }

    /**
     * Opens the confirmation dialog displayed before deleting a friend
     */
    openDialog(): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent);

        dialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe(result => result && this.deleteCurrentFriend());
    }

    /**
     * Navigates back to  friend list page
     */
    navigateBack() {
        this.router.navigate(['friends']).then();
    }

    /**
     * Deletes current friend
     */
    deleteCurrentFriend() {
        this.friend$
            .pipe(
                take(1),
                switchMap((friend: Friend) =>
                    this.friendsService.deleteFriend$(friend).pipe(
                        tap(() => {
                            this.snackBar.open(
                                `Friend: ${friend.name} was deleted successfully!`,
                                undefined,
                                {
                                    duration: 3000,
                                }
                            );
                            this.navigateBack();
                        })
                    )
                ),
                catchError(error =>
                    of(error).pipe(
                        // Better way could be displaying a user-friendly error message in an error banner at the top
                        // of the form
                        tap(({code, description}) => {
                            this.snackBar.open(
                                `Error deleting: ${code}:${description}`,
                                'DISMISS'
                            );
                        })
                    )
                )
            )
            .subscribe();
    }
}
