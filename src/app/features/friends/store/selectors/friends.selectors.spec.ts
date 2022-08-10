import { selectFriend } from './friends.selectors';
import { fiveFriendsList, friend2 } from '../../models/friends.mocks';

describe('Friend Selectors Tests', () => {
  describe('When selecting a friend using selectFriend selector', () => {
    it('should get the requested friend from the state', () => {
      const res = selectFriend.projector(fiveFriendsList, {
        friendId: '2',
      });

      expect(res).toEqual(friend2);
    });
  });

  describe('When selecting a non existing friend using selectFriend selector', () => {
    it('should throw an exception', () => {
      let res: any;
      try {
        const res = selectFriend.projector(fiveFriendsList, {
          friendId: '999',
        });
      } catch (error) {
        res = error;
      }

      expect(res?.code).toEqual('002');
    });
  });
});
