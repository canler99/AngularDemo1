import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable, of, switchMap} from 'rxjs';
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

  protected listcontext$ = this.friendsService.getFriendsListContext$();

  protected friends$: Observable<Friend[]> = of("").pipe(
      switchMap(() => this.friendsService.getFriendsPage$()),
  );

  constructor(protected readonly friendsService: FriendsService) {
  }

  ngOnInit(): void {
  }

  loadNextPageClicked() {
    this.friendsService.loadFriendListNextPage(10);
  }

  isDisplayButtonVisible(listContext: ListContext): boolean {
    return !!listContext && (listContext.currentPage > 0) && (listContext.currentPage < listContext.pageCount);
  }

  listSelectionChanged(event: MatSelectionListChange) {
    this.friendSelectedEvent.emit(event?.options[0]?.value);
  }
}
