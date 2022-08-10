import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private _title = '';

  get title(): string {
    return this._title;
  }

  set title(newTitle: string) {
    this._title = newTitle;
  }
}
