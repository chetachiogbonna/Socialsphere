import CommentSection from "./CommentSection"
import { useEffect, useState } from "react"
import { useBookmarkAndUnbookPost, useLikeAndUnlikePost } from "@/react-query"
import { useUser } from "@/hooks/useUser"
import { checkIfPostIsBookmarked, checkIfPostIsLiked, cn } from "@/lib/utils"

function PostStats({ post, showComment = true, isPending }: { post: Post, showComment?: boolean, isPending: boolean }) {
  const { currentUserId } = useUser();

  const [likes, setLikes] = useState(post.likes)
  const [bookmarks, setBookmarks] = useState(post.saves)

  useEffect(() => {
    setLikes(post.likes)
    setBookmarks(post.saves)
  }, [likes, bookmarks, isPending]);

  const { mutateAsync: likePost } = useLikeAndUnlikePost();
  const { mutateAsync: bookmarkPost } = useBookmarkAndUnbookPost();

  const handleLikePost = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();

    let likesArray = [...likes];
    const hasLikedPost = likesArray.find(like => like === currentUserId)

    if (hasLikedPost) {
      likesArray = likesArray.filter(like => like !== currentUserId)
    } else {
      likesArray.push(currentUserId as string)
    }

    setLikes(likesArray)
    
    await likePost({
      post: post,
      userId: currentUserId as string
    })

    setLikes(post.likes)
  }
  
  const handleBookmarkPost = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();

    let bookmarkArray = [...bookmarks];
    const hasBookmarkedPost = bookmarkArray.includes(currentUserId as string)
    
    if (hasBookmarkedPost) {
      bookmarkArray = bookmarkArray.filter(bookmark => bookmark !== currentUserId)
    } else {
      bookmarkArray.push(currentUserId as string)
    }
    
    setBookmarks(bookmarkArray)

    await bookmarkPost({
      post: post,
      userId: currentUserId as string
    });

    setBookmarks(post.saves)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="flex space-x-3 justify-between">
          <div className="flex items-center space-x-1">
            <img className={cn("cursor-pointer change-icon w-6 h-6")}
              src={checkIfPostIsLiked(currentUserId as string, post.likes)
                ? "/assets/icons/liked.svg"
                : "/assets/icons/like.svg"
              }
              onClick={handleLikePost} 
              alt="like"
           />
            <p>{post.likes.length}</p>
          </div>
          <div className="flex items-center space-x-1">
            <img 
              className="cursor-pointer change-icon w-6 h-6" 
              src="/assets/icons/comment.svg" 
              onClick={(e) => e.stopPropagation()}
              alt="" 
            />
            <p>{post.comments.length} </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <img 
            className="cursor-pointer w-6 h-6"
            onClick={handleBookmarkPost}  
            src={checkIfPostIsBookmarked(currentUserId as string, post.saves)
                ? "/assets/icons/bookmarked.svg"
                : "/assets/icons/bookmark.png"
              }
            alt="bookmark" 
          />
          <p>{post.saves.length}</p>
        </div>
      </div>

      {showComment && <CommentSection post={post} />}
    </div>
  )
}

export default PostStats