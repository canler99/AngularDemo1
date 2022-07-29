import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {TitleService} from '../../services/title-service/title.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit {

  constructor(private readonly titleService: TitleService) {
  }

  ngOnInit(): void {
    this.titleService.title = "Home";
  }
}
