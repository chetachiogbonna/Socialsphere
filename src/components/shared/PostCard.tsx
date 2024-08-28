import { Link, useNavigate } from "react-router-dom"
import PostStats from "./PostStats"
import { useDeletePost, useGetUserById } from "@/react-query";
import { cn, convertToReadableDateString } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "../ui/use-toast";

function PostCard({ post, isPending }: { post: Post, isPending: boolean }) {
  const navigate = useNavigate();
  const { currentUserId } = useUser();

  const { data: user } = useGetUserById(post.userId)

  const isPostOwned = currentUserId === post.userId;

  const [showEditAndDelete, setShowEditAndDelete] = useState(false)
  const [deletePost, setDeletePost] = useState(false)

  useEffect(() => {
    const handleWindowClick = () => {
      setShowEditAndDelete(false)
    }

    window.addEventListener("click", handleWindowClick)

    return () => {
      window.removeEventListener("click", handleWindowClick)
    }
  }, [])

  const { mutateAsync, error: deletePostError, isPending: isDeleting } = useDeletePost()

  const handleDeletePost = async () => {
    try {
      await mutateAsync({
        postId: post.postId,
        postImageUrl: post.imageUrl
      })
    } catch (error) {
      toast({
        title: deletePostError?.message
      })
      console.log(error)
    }
  }
    
  return (
    <li
      className="flex flex-col gap-3 bg-dark-5 border border-light rounded-xl px-2 md:px-6 pb-7 pt-2 w-full max-w-[500px] mx-auto"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div 
            onClick={() => navigate(`/profile/${post.userId}`)}
            className="w-[40px] h-[40px] cursor-pointer"
          >
            <img className="w-full h-full rounded-full" src={user?.profilePicUrl} alt="profile pic" />
          </div>
          <div>
            <h2 
              onClick={() => navigate(`/profile/${post.userId}`)}
              className="hover:underline capitalize cursor-pointer"
            >
              {user?.name}
            </h2>
            <h3 
              className="text-gray-600 text-xs"
            >
              {convertToReadableDateString(post.createdAt)} 
              <span className="font-bold"> &bull; </span>
              {post.location}
            </h3>
          </div>
        </div>

        <div className={cn("hidden relative", { "block": isPostOwned })}>
          {showEditAndDelete && (
            <div className="absolute flex flex-col gap-1 rounded-md right-10 -top-2.5 bg-[#1A1A1A] py-1 pl-1 pr-8 border border-light showEditAndDelete">
              <p
                className="flex items-center gap-1 text-xs cursor-pointer"
                onClick={() => navigate(`/edit-post/${post.postId}`)}
              >
                <img 
                  width={20}
                  height={20}
                  onClick={() => navigate(`edit-post/${post.postId}`)} 
                  className={cn("cursor-pointer hidden change-icon", { "block": isPostOwned })} 
                  src="/assets/icons/edit.svg"
                  alt="edit icon" 
                />
                Edit
              </p>
              <p 
                className="flex items-center gap-1 text-xs cursor-pointer"
                onClick={() => setDeletePost(true)}
              >
                <img 
                  width={20}
                  height={20}
                  src="/assets/icons/delete.svg" 
                  alt="" 
                />
                Delete
              </p>
            </div>
          )}

          <img
            onClick={(e) => {
              e.stopPropagation()
              setShowEditAndDelete(prev => !prev)
            }} 
            className="cursor-pointer"
            src="/assets/icons/three-dot.svg" 
            alt="" 
          />
        </div>
      </div>

      <hr className="border-light" />

      <Link to={`/post-details/${post.postId}`}>
        <h4 className="line-clamp-2 mb-3">{post.title}</h4>
        <div className="h-[350px]">
          <img className="w-full h-full rounded-xl" src={post.imageUrl} alt="post image" />
        </div>
      </Link>
      <PostStats post={post} isPending={isPending} />

      {deletePost && (
        <AlertDialog open={deletePost}>
          <AlertDialogContent className="bg-dark-3">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. If you delete this post, You won't be able to access it again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                className="bg-dark-2"
                onClick={() => setDeletePost(false)}
              >Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-blue hover:bg-blue"
                onClick={handleDeletePost}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </li>
  )
}

export default PostCard