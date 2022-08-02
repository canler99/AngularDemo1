import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {TitleService} from '../../services/title-service/title.service';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent implements OnInit {
  constructor(private readonly titleService: TitleService) {
  }

  ngOnInit(): void {
    this.titleService.title = 'Error: Page not found !';
  }
}
