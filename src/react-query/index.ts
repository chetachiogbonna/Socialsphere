import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { bookmarkAndUnbookPost, chatFriend, commentToPost, createNewPost, createNewUserAccount, deletePost, getAllPosts, getAllUsers, getFriendsChats, getPostById, getPostByUser, getUserBookmarkedPosts, getUserById, likeAndUnlikePost, setUserProfile, signInUserAccount, updatePost } from "@/lib/config/api";
import { useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";

export const useSignInUserAccount = () => {
  return useMutation({
    mutationFn: (user: { 
      email: string, 
      password: string 
    }) => signInUserAccount(user.email, user.password),
  })
}

export const useSignUpUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createNewUserAccount(user),
  })
}

export const useGetAllPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsPending(true);

    let unsubscribe: Unsubscribe | null = null;

    const getPosts = async () => {
      try {
        unsubscribe = await getAllPosts((posts) => {
          setPosts(posts)
          setIsPending(false);
        })
      } catch (error) {
        const errorObject = error instanceof Error ? error : null;
        setError(errorObject);
        setIsPending(false);
      }
    };

    getPosts();

    return () => {
      if (unsubscribe) unsubscribe();
    }
  }, []);

  return { posts, isPending, error };
}

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: ["posts", postId],
    queryFn: () => getPostById(postId)
  })
}

export const useCreateNewPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPost: INewPost) => createNewPost(newPost),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["posts"]
      })
    },
  })
}

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUserById(userId)
  })
}

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers
  })
}

export const useSetUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: { coverImgUrl: string, coverImgFilePath: File, profilePicUrl: string, profileImgFilePath: File, userId: string, bio: string
    }) => setUserProfile(user),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ["users", userId]
      })
    }
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postToUpdate: IEditPost) => updatePost(postToUpdate),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"]
      });
      queryClient.invalidateQueries({
        queryKey: ["posts", postId]
      })
    }
  })
}

export const useDeletePost = () => {
  return useMutation({
    mutationFn: ({
      postId,
      postImageUrl
    }: { postId: string, postImageUrl: string}) => deletePost(postId, postImageUrl)
  })
}

export const useGetPostByUser = (userId: string) => {
  return useQuery({
    queryKey: ["userPosts"],
    queryFn: () => getPostByUser(userId)
  })
}

export const useChatFriend = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (message: Chat) => chatFriend(message),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chats"]
      })
    }
  })
}

export const useGetFriendsChats = (chatId: string) => {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsPending(true);

    let unsubscribe: Unsubscribe | null = null;

    const getFriendsMessages = async () => {
      try {
        unsubscribe = await getFriendsChats(chatId, (chats) => {
          setMessages(chats);
          setIsPending(false);
        });
      } catch (error) {
        const errorObject = error instanceof Error ? error : null;
        setError(errorObject);
        setIsPending(false);
      }
    };

    getFriendsMessages();

    return () => {
      if (unsubscribe) unsubscribe();
    }
  }, [chatId]);

  return { messages, isPending, error };
};

export const useGetUserBookmarkedPosts = (userId: string) => {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getUserBookmarkedPosts(userId)
  })
}

export const useCommentToPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ comment, post }: { 
      comment: IComment, 
      post: Post 
    }) => commentToPost(comment, post),
    onSuccess: (_, { comment: { postId } }) => {
      queryClient.invalidateQueries({
        queryKey: ["posts", postId]
      })

      queryClient.invalidateQueries({
        queryKey: ["posts"]
      })
    }
  })
}

export const useLikeAndUnlikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      post,
      userId, 
    }: { 
      post: Post, 
      userId: string, 
    }) => likeAndUnlikePost(post, userId),
    onSuccess: (_, { post: { postId } }) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"]
      })
      queryClient.invalidateQueries({
        queryKey: ["posts", postId]
      })
    }
  })
}

export const useBookmarkAndUnbookPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      post, 
      userId
    }: { 
      post: Post, 
      userId: string
    }) => bookmarkAndUnbookPost(post, userId),
    onSuccess: (_, { post: { postId } }) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"]
      })
      queryClient.invalidateQueries({
        queryKey: ["posts", postId]
      })
    }
  })
}