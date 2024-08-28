import Loader from "@/components/shared/Loader";
import PostForm from "@/components/shared/PostForm"
import { useGetPostById } from "@/react-query";
import { useParams } from "react-router-dom"

function EditPost() {
  const { postId } = useParams();

  const { data: post, isPending } = useGetPostById(postId as string);

  if (isPending) {
    return <Loader className="mx-auto" />
  }

  return (
    <section className="pt-3 pb-32 md:pb-20">
      <div className="mx-auto mb-14 flex gap-1 items-center w-[98%] md:w-[80%]">
        <img src="/assets/icons/like.png" className="change-icon" width={40} height={40} alt="edit post" />
        <h2 className="text-2xl font-medium">Edit Post</h2>
      </div>

      <PostForm action="Edit" post={post} />
    </section> 
  )
}

export default EditPost