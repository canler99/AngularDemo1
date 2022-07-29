import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {TitleService} from '../../services/title-service/title.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent implements OnInit {

  constructor(private readonly titleService: TitleService) {
  }

  ngOnInit(): void {
    this.titleService.title = "Settings";
  }
}
