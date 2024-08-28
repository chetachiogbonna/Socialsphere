import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from '@/lib/config/firebase';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const signInUserAccount = async (email: string, password: string) => {
  try {
    const loggedInUser = await signInWithEmailAndPassword(auth, email, password)
    return loggedInUser;
  } catch (error) {
    console.error(error);
    throw error
  }
}

export const createNewUserAccount = async (user: INewUser) => {
  const { name, email, username, password } = user;
  
  try {
    const newAccount = await createUserWithEmailAndPassword(auth, email, password)
    if (newAccount) {
      const res = await getCurrentUser()
      const userId = res?.uid as string;

      const usersCollectionRef = doc(db, "users", userId);

      const newUser = {
        name,
        email,
        username,
        userId,
        coverImgUrl: null,
        profilePicUrl: null,
        bio: "",
        saves: [],
        likes: [],
        following: [],
        follower: []
      }
      await setDoc(usersCollectionRef, newUser);
      return newAccount;
    }
  } catch (error) {
    console.log(error);
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe(); 
      resolve(user);
    }, reject);
  });
};

export const getAllPosts = async (callback: (posts: Post[]) => void) => {
  const postsCollectionRef = collection(db, "posts");
  const q = query(postsCollectionRef, orderBy("updatedAt", "desc"))

  try {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          postId: doc.id
        } as Post
      })

      callback(posts);
    });

    return unsubscribe; 

  } catch (error) {
    console.error("Error fetching posts: ", error);
    throw error;
  }
};

export const getPostById = async (postId: string) => {
  const postCollectionRef = doc(db, "posts", postId);

  try {
    const doc = await getDoc(postCollectionRef);
    const post = { 
      ...doc.data(),
      postId: doc.id
    } as Post

    return post;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const createNewPost = async ({ imageFilePath, ...newPost }: INewPost) => {
  const postsCollectionRef = collection(db, "posts");
  if (!newPost) return;

  try {
    newPost.imageUrl = await getImageUrlAndSaveToStorage(imageFilePath as unknown as File) as string;
    
    const post = await addDoc(postsCollectionRef, newPost);
    return post;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const updatePost = async ({ imageFilePath, ...updatePost }: IEditPost) => {
  const postDocRef = doc(db, "posts", updatePost.postId);

  try {
    const imageUrl = await getImageUrlAndSaveToStorage(imageFilePath as unknown as File) || updatePost.imageUrl;
    const postToUpdate = {
      ...updatePost,
      imageUrl
    }  

    const updatedPost = await updateDoc(postDocRef, postToUpdate)
    return updatedPost;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getUserById = async (userId: string) =>  {
  const userDocRef = doc(db, "users", userId);

  try {
    const doc = await getDoc(userDocRef);
    const user = { 
      ...doc.data(),
      userId: doc.id
    } as IUser;

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getAllUsers = async () =>  {
  const usersCollectionRef = collection(db, "users");
  
  try {
    const res = await getCurrentUser();
    const userId = res?.uid;
    const q = query(usersCollectionRef, where("userId", "!=", userId));

    const data = await getDocs(q);
    const allUsers = data.docs.map(doc => {
      return { 
        ...doc.data(),
        userId: doc.id
      } as IUser;
    });

    return allUsers;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const setUserProfile = async ({ coverImgFilePath, profileImgFilePath, ...user } : {
  coverImgUrl: string,
  coverImgFilePath: File,
  profilePicUrl: string,
  profileImgFilePath: File,
  bio: string
}) => {
  if (!coverImgFilePath || !profileImgFilePath) return;
  
  try {
    const res = await getCurrentUser();
    const userId = res?.uid as string;
    const userDocRef = doc(db, "users", userId);
    const coverImgUrl = await getImageUrlAndSaveToStorage(coverImgFilePath)
    const profilePicUrl = await getImageUrlAndSaveToStorage(profileImgFilePath)

    const userProfile = {
      ...user,
      coverImgUrl: coverImgUrl!,
      profilePicUrl: profilePicUrl!
    }
    console.log(userProfile)
    await updateDoc(userDocRef, userProfile)
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const getImageUrlAndSaveToStorage = async (imageFilePath: File) => {
  if (!imageFilePath) return;

  const id = crypto.randomUUID();
  const imageRef = ref(storage, `images/${imageFilePath.name + id}`)
  try {
    const snapShot = await uploadBytes(imageRef, imageFilePath)
    const url = await getDownloadURL(snapShot.ref);
    return url;
  } catch (error) {
    console.error(error)
  }
}

export const deletePost = async (postId: string, postImageUrl: string) => {
  const postRef = doc(db, "posts", postId)

  try {
    await deleteImage(postImageUrl)
    await deleteDoc(postRef);
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteImage = async (imageUrl: string) => {
  if (!imageUrl) return;

  const imageRef = ref(storage, imageUrl)

  try {
    await deleteObject(imageRef)
    return "success"
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getPostByUser = async (userId: string) => {
  const postCollectionRef = collection(db, "posts");
  const q = query(postCollectionRef, where("userId", "==", userId));

  try {
    const data = await getDocs(q);
    const userPosts = data.docs.map(doc => ({
      ...doc.data(),
      postId: doc.id
    }) as Post);

    return userPosts;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const chatFriend = async (messageToSend: Chat) => {
  const chatCollectionRef = collection(db, "chats");
  
  try {
    if (typeof messageToSend.message === "string") {
      messageToSend.type = "text";
    } else {
      messageToSend.type = "image";
      messageToSend.message = await getImageUrlAndSaveToStorage(messageToSend.message) as string;
    }
    const addedMessage = await addDoc(chatCollectionRef, messageToSend);
    return addedMessage;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getFriendsChats = async (chatId: string, callback: (chats: Chat[]) => void) => {
  const chatCollectionRef = collection(db, "chats");
  const q = query(chatCollectionRef, where("chatId", "==", chatId), orderBy("createdAt"))
  
  try {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => {
        return {
          ...doc.data()
        } as Chat
      })

      callback(chats);
    });

    return unsubscribe; 
    
  } catch (error) {
    console.log(error);
    throw error;
  } 
}

export const getUserBookmarkedPosts = async (userId: string) => {
  const postCollectionRef = collection(db, "posts");
  const q = query(postCollectionRef, where("saves", "array-contains", userId))

  try {
    const data = await getDocs(q);
    const bookmarkedPosts = data.docs.map(doc => {
      return {
        ...doc.data(),
        postId: doc.id
      } as Post
    });

    return bookmarkedPosts;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const commentToPost = async (comment: IComment, post: Post) => {
  const postRef = doc(db, "posts", comment.postId);
  
  try {
    const postToComment = {
      comments: [
        ...post.comments,
        comment
      ]
    }

    const commentedPost = await updateDoc(postRef, postToComment);
    return commentedPost;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const likeAndUnlikePost = async (post: Post, userId: string) => {
  const postRef = doc(db, "posts", post.postId);

  let likesArray = [...post.likes];
  const hasLikedPost = likesArray.find(like => like === userId)

  if (hasLikedPost) {
    likesArray = likesArray.filter(like => like !== userId)
  } else {
    likesArray.push(userId)
  }

  const postLikes = {
    likes: [
      ...likesArray
    ]
  }

  try {
    await updateDoc(postRef, postLikes);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const bookmarkAndUnbookPost = async (post: Post, userId: string) => {
  const postRef = doc(db, "posts", post.postId);

  let bookmarkArray = [...post.saves];
  const hasBookmarkedPost = bookmarkArray.includes(userId)
  
  if (hasBookmarkedPost) {
    bookmarkArray = bookmarkArray.filter(bookmark => bookmark !== userId)
  } else {
    bookmarkArray.push(userId)
  }
  
  const postBookmarks = {
    saves: [
      ...bookmarkArray
    ]
  }

  try {
    await updateDoc(postRef, postBookmarks);
  } catch (error) {
    console.log(error);
    throw error;
  }
}