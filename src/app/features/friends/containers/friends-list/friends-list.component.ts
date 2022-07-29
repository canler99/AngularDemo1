import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable, of, switchMap} from 'rxjs';
import {Friend} from '../../models/friends.types';
import {FriendsService} from '../../services/friends.service';
import {ListContext} from '../../store/friends-store.types';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendsListComponent implements OnInit {
  protected isLoading$ = this.friendsService.getFriendsListContext$().pipe(
      map((context: ListContext) => context.loading)
  );

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
}
