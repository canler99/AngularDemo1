import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../../services/title-service/title.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Friend} from '../../models/friends.types';

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.scss']
})
export class FriendsPageComponent implements OnInit {

  constructor(
      private readonly titleService: TitleService,
      private readonly router: Router,
      private readonly route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.titleService.title = "Friends";
  }

  friendSelectedEvent(selectedFriend: Friend | {}) {
    this.router.navigate(['details', (selectedFriend as Friend)?.id], {
      relativeTo: this.route,
    });
  }
}
