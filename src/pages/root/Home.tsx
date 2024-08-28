import { useGetAllPosts } from "@/react-query"
import RightSideBar from "@/components/shared/RightSideBar";
import PostCard from "@/components/shared/PostCard";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/shared/Loader";

function Home() {
  const { toast } = useToast();
  const { posts, isPending, error } = useGetAllPosts();

  if (error) {
    toast({
      title: error.message,
      variant: "destructive"
    })
  }

  return (
    <section className="flex flex-col gap-4 pt-3 pb-44 xl:pb-20">
      <div className="lg:mx-auto xl:pr-[20%]">
        <h2 className="text-[20px] font-semibold w-[98%] mx-auto text-left md:w-full md:text-center">Home Feed</h2>
      </div>

      {isPending 
        ? <Loader className="xl:pr-[22%] mx-auto" />
        : <ul className="xl:pr-[22%] w-[98%] md:w-full flex flex-col gap-10 mx-auto">
          {posts?.map(post => (
            <PostCard key={post.postId} post={post} isPending={isPending} />
          ))}
        </ul>
      }

      <RightSideBar /> 
    </section>
  )
}

export default Home