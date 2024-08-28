import { LucideSendHorizontal } from "lucide-react"
import { Input } from "../ui/input"
import { useUser } from "@/hooks/useUser"
import { useCommentToPost, useGetUserById } from "@/react-query";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useState } from "react";

function CommentSection({ post }: { post: Post }) {
  const [commentText, setCommentText] = useState("");

  const { toast } = useToast();
  const navigate = useNavigate();

  const { currentUserId } = useUser();
  const { data: userData } = useGetUserById(currentUserId as string)

  const { mutateAsync: commentPost, error, isPending: isCommenting } = useCommentToPost();

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/post-details/${post.postId}`);

    const comment = {
      userId: currentUserId as string,
      commentProfilePicUrl: userData?.profilePicUrl as string,
      postId: post.postId,
      commentText
    }

    await commentPost({ comment, post });

    setCommentText("");

    if (error) {
      return toast({
        title: error.message,
        variant: "destructive"
      })
    }

    toast({
      title: "commented successfully"
    })
  }

  return (
    <form className="flex gap-2 justify-center items-center" onSubmit={handleComment}>
      <div className="w-10 h-10 rounded-full">
        <img width={40} height={40} className="rounded-full bg-gray-900" src={userData?.profilePicUrl || "/assets/icons/save.png"} alt="profile pic" />
      </div>
      <div className="flex items-center border-[1.5px] border-light w-[87%] rounded-md">
        <Input 
          required
          disabled={isCommenting}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="h-8 bg-dark-5 border-none focus-visible:ring-0 focus-visible:ring-offset-0" 
          placeholder="Leave a reply..." 
          type="text" 
        />
      </div>
    
      {isCommenting
        ? <div className="w-min">
            <Loader className="text-[#3C404B]" />
          </div>
        : <button
            disabled={isCommenting}
          >
            <LucideSendHorizontal 
              color="#3C404B"
            />
          </button>
      }
    </form>
  )
}

export default CommentSection;