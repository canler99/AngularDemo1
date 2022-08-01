import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {filter, Observable, switchMap, take, tap} from 'rxjs';
import {Friend} from '../../models/friends.types';
import {ActivatedRoute, Router} from '@angular/router';
import {FriendsService} from '../../services/friends.service';
import {FormBuilder, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-friend-edit',
  templateUrl: './friend-edit.component.html',
  styleUrls: ['./friend-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendEditComponent implements OnInit {

  protected friend$: Observable<any> = this.route.params.pipe(
      filter(({id}) => !!id),
      switchMap(({id}) => this.friendsService.getFriendById$(id)),
      tap(friend => console.log("Paso con ", friend)),
  );

  protected editFriendForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    age: ['0', [Validators.required]],
    weight: ['0', [Validators.required]],
  });

  constructor(
      private router: Router,
      private readonly route: ActivatedRoute,
      private formBuilder: FormBuilder,
      private readonly friendsService: FriendsService
  ) {
  }

  ngOnInit(): void {
    this.friend$.pipe(
        take(1),
        tap(friend => this.updateFriendFormDataFromModel(friend)),
    ).subscribe();
  }

  updateFriendFormDataFromModel(friend: Friend) {
    this.editFriendForm.setValue({
      name: friend.name,
      age: friend.age.toString(),
      weight: friend.weight.toString()
    });
  }

  convertFriendFormDataToModel(friend: Friend): Friend {
    const formValue = this.editFriendForm.value;

    return {
      ...friend,
      name: formValue.name ?? '',
      age: +(formValue.age ?? 0),
      weight: +(formValue.weight ?? 0),
    };
  }

  closeBtnClicked() {
    this.friend$.pipe(take(1)).subscribe((friend: Friend) => {
      this.router.navigate(['friends', 'details', friend?.id]);
    });
  }

  onSubmit() {
    console.log(this.editFriendForm.value);

    this.friend$.pipe(
        take(1),
        map((friend: Friend) => this.convertFriendFormDataToModel(friend)),
        switchMap((friend: Friend) => this.friendsService.updateFriend(friend))
    ).subscribe();
  }
}
