import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable, of, switchMap, take, tap} from 'rxjs';
import {Friend} from '../../models/friends.types';
import {FriendsService} from '../../services/friends.service';
import {ListContext} from '../../store/friends-store.types';
import {MatSelectionListChange} from '@angular/material/list';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendsListComponent implements OnInit {
  @Output() friendSelectedEvent = new EventEmitter<Friend>();

  protected listContext$ = this.friendsService.getFriendsListContext$();

  protected friends$: Observable<Friend[]> = of("").pipe(
      switchMap(() => this.friendsService.getFriendsList$()),
  );

  constructor(protected readonly friendsService: FriendsService) {
  }

  ngOnInit(): void {
    // dispatch the action to load the first page only once
    this.listContext$.pipe(
        take(1),
        tap(({currentPage}) => currentPage === 0 && this.friendsService.loadFriendListNextPage()),
    ).subscribe();
  }

  loadNextPageClicked() {
    this.friendsService.loadFriendListNextPage(10);
  }

  isDisplayButtonVisible(listContext: ListContext): boolean {
    return !!listContext &&
        (listContext.currentPage > 0) &&
        (listContext.currentPage < listContext.pageCount) &&
        (!listContext?.loading) &&
        (!listContext?.error);
  }

  listSelectionChanged(event: MatSelectionListChange) {
    this.friendSelectedEvent.emit(event?.options[0]?.value);
  }
}
