import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../../services/title-service/title.service';

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.scss']
})
export class FriendsPageComponent implements OnInit {

  constructor(private readonly titleService: TitleService) {
  }

  ngOnInit(): void {
    this.titleService.title = "Friends";
  }
}
