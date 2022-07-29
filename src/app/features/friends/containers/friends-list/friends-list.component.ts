import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of, switchMap, tap} from 'rxjs';
import {Friend} from '../../models/friends.types';
import {FriendsService} from '../../services/friends.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendsListComponent implements OnInit {

  private _isSpinnerVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  protected isSpinnerVisible = this._isSpinnerVisible.asObservable();

  protected friends$: Observable<Friend[]> = of("").pipe(
      tap(_ => this._isSpinnerVisible.next(true)),
      switchMap(() => this.friendsService.getFriendsPage$()),
      tap(_ => this._isSpinnerVisible.next(true)),
  );

  constructor(private readonly friendsService: FriendsService) {
  }

  ngOnInit(): void {
  }
}
