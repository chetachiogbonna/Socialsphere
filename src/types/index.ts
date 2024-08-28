declare type INewUser = { 
  name: string, 
  email: string, 
  username: string, 
  password: string
}

declare type IComment = {
  userId: string,
  commentProfilePicUrl: string,
  postId: string,
  commentText: string
}

declare type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};

declare type INewPost = {
  title: string,
  imageUrl: string,
  imageFilePath?: File,
  userId: string,
  location: string,
  tags: string,
  createdAt: FirestoreTimestamp,
  updatedAt: FirestoreTimestamp,
  likes: string[],
  saves: string[],
  comments: IComment[]
}

declare type IEditPost = {
  title: string,
  imageUrl: string,
  imageFilePath?: File,
  userId: string,
  postId: string,
  location: string,
  tags: string,
  createdAt: FirestoreTimestamp,
  updatedAt: FirestoreTimestamp,
  likes: string[],
  saves: string[],
  comments: IComment[]
}

declare type Post = {
  title: string,
  imageUrl: string,
  userId: string,
  postId: string,
  location: string,
  tags: string,
  createdAt: FirestoreTimestamp,
  updatedAt: FirestoreTimestamp,
  likes: string[],
  saves: string[],
  comments: IComment[]
}

declare type IUser = {
  coverImgUrl: string,
  profilePicUrl: string,
  name: string,
  userId: string,
  bio: string,
  follower: string[],
  following: string[],
  saves: string[],
  likes: string[]
}


declare type Chat = {
  chatId: string,
  type: string,
  userId: string,
  message: string,
  createdAt: FirestoreTimestamp
}