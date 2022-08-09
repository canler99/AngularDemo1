import {Friend} from './friends.types';

/**
 * Default empty object declaration used for initialization when adding a new friend
 */
export const defaultEmptyFriend: Friend = {
  id: '',
  name: '',
  age: 0,
  weight: 0,
  friendIds: [],
};

export const singleFriend: Friend = {
  id: '1',
  name: 'A',
  age: 1,
  weight: 1,
  friendIds: ['2', '3'],
};

export const friend2: Friend = {
  id: '2',
  name: 'B',
  age: 2,
  weight: 3,
  friendIds: ['1'],
};

export const friend3: Friend = {
  id: '3',
  name: 'C',
  age: 3,
  weight: 3,
  friendIds: ['2'],
};

export const friend4: Friend = {
  id: '4',
  name: 'D',
  age: 4,
  weight: 4,
  friendIds: ['3'],
};

export const friend5: Friend = {
  id: '5',
  name: 'E',
  age: 5,
  weight: 5,
  friendIds: ['4'],
};

export const singleFriendList: Friend[] = [singleFriend];
export const twoFriendsList: Friend[] = [friend2, friend3];
export const fiveFriendsList: Friend[] = [
  singleFriend,
  friend2,
  friend3,
  friend4,
  friend5,
];

export const friendsFourAndFiveList: Friend[] = [friend4, friend5];

export const listContextObj = {
  currentPage: 1,
  pageSize: 10,
  pageCount: 3,
  loading: false,
};
