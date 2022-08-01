import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {filter, Observable, switchMap, take, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {FriendsService} from '../../services/friends.service';
import {Friend} from '../../models/friends.types';

@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.component.html',
  styleUrls: ['./friend-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendDetailsComponent implements OnInit {

  protected friend$: Observable<any> = this.route.params.pipe(
      tap(v => console.log("Friends details2-1 ", v)),
      filter(({id}) => !!id),
      switchMap(({id}) => this.friendsService.getFriendById$(id)),
      tap(v => console.log("Friends details2-2 ", v)),
  );

  constructor(
      private router: Router,
      private readonly route: ActivatedRoute,
      private readonly friendsService: FriendsService
  ) {
  }

  ngOnInit(): void {
  }

  editFriendBtnClicked() {
    this.friend$.pipe(take(1)).subscribe((friend: Friend) => {
      this.router.navigate(['friends', 'edit', friend?.id]);
    });
  }
}
