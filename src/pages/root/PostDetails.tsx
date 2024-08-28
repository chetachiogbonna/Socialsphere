import CommentSection from "@/components/shared/CommentSection";
import PostBox from "@/components/shared/PostBox";
import PostStats from "@/components/shared/PostStats";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useGetAllPosts, useGetPostById, useGetUserById } from "@/react-query";
import { Link, useNavigate, useParams } from "react-router-dom"
import NotFound from "../NotFound";
import Loader from "@/components/shared/Loader";

function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const { data: post, isPending, error: postError } = useGetPostById(postId as string); 
  const { data: postOwner } = useGetUserById(post?.userId as string);
  const { posts } = useGetAllPosts();

  if (isPending) {
    return (
      <Loader className="mx-auto" />
    )
  }

  if (postError) {
    toast({
      title: postError.message,
      variant: "destructive"
    })
  }

  if (!post) {
    return (
      <NotFound/>
    )
  }

  return (
    <section className="mt-2 px-1 md:px-6 pb-44 xl:pb-20 scroll-mt-16">
      <div 
        className="flex flex-col justify-center gap-3 border border-light rounded-xl px-2 md:px-6 p-2 w-[98%] md:w-[90%] bg-dark-5 mx-auto max-h-[1270px] overflow-hidden"
      >
        <div className="w-full h-full flex flex-col justify-center gap-3">
          <div className="h-16 flex justify-between items-center xl:-mt-3">
            <Link to={`/profile/${post?.userId}/?display=posts`} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full">
                <img className="w-10 h-10 rounded-full" src={postOwner?.profilePicUrl || "/assets/icons/save.png"} alt="profile pic" />
              </div>
              <div>
                <h2 className="capitalize">{postOwner?.name}</h2>
                <h3 className="hover:underline text-gray-600">@{postOwner?.name}</h3>
              </div>
            </Link>
            <img onClick={() => navigate(`/edit-post/${post?.postId}`)} className="w-[30px] cursor-pointer change-icon" src="/assets/icons/edit.svg" alt="edit icon" />
          </div>

          <hr className="border-light" />

          <div>
            <div className="overflow-hidden">
              <h4 className="mb-3">
                {post?.title}
              </h4>
            </div>
            <div className="h-[300px] md:h-[500px] w-full">
              <img className="w-full h-full rounded-xl" src={post?.imageUrl} alt="post image" />
            </div>
          </div>
          <PostStats post={post as Post} showComment={false} isPending={isPending} />
        </div>
        <div className="w-full h-full relative overflow-hidden flex flex-col justify-center gap-3">
          <div className="absolute top-0 right-0 left-0 h-16 text-center bg-dark-5 border-b border-light z-10">
            Comment
          </div>
          <div className={cn("overflow-y-auto pt-20 pb-8 border border-light h-[500px] comment-box-container", { "flex justify-center items-center": post?.comments.length > 0 === false})}>
            {post?.comments.length > 0
              ? post?.comments.map(comment => {
                  return (
                    <div className="rounded-lg flex justify-end items-end last:pb-5 w-[90%] ml-auto">
                      <div className="w-full flex items-start justify-end mb-2 gap-3">
                        <div className="w-full flex justify-end">
                          <div className="comment-box-right">
                            <p>{comment.commentText}</p>
                            <span className="text-[10px] text-gray-300">11:40 PM</span>
                          </div>
                        </div>
                        <div className="w-28 h-28 rounded-full">
                          <img className="w-10 h-10 rounded-full" src={comment.commentProfilePicUrl} alt="profile pic" />
                        </div>
                      </div>
                    </div>
                  )
                })
              : <p className="flex justify-center items-center text-center h-16">No comment yet, be the first to comment.</p>
            }
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-dark-5 border-t border-light pt-1">
            <CommentSection post={post} />
          </div>
        </div>
      </div>

      <div className="w-[90%] mx-auto mt-10">
        <h2 className="mb-8">You might also like.</h2>

        <ul className="w-full mx-auto grid max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {posts?.map(post => (
            <PostBox post={post} user={postOwner!} isPending={isPending} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default PostDetails