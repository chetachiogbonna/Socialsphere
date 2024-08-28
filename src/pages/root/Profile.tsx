import Loader from "@/components/shared/Loader";
import PostBox from "@/components/shared/PostBox";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { useGetPostByUser, useGetUserById } from "@/react-query";
import { useNavigate, useParams } from "react-router-dom";

function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate();
  const { currentUserId } = useUser()

  const { data: user } = useGetUserById(userId as string)
  const { data: userPosts, isPending: isUserPostsPending } = useGetPostByUser(userId as string);

  const myProfile = currentUserId! === user?.userId!

  return (
    <section className="px-2 pt-3 pb-56 md:pb-20 lg:w-[90%] mx-auto flex flex-col font-sans">
      <div className="w-full h-[70dvh] rounded-t-xl xl:rounded-t-3xl bg-dark-3 rounded-b-xl">
        <div className="w-full h-[35dvh] relative">
          <div className="w-full h-full rounded-t-xl xl:rounded-t-3xl border border-light bg-dark-2">
            <img className="w-full h-full rounded-t-xl xl:rounded-t-3xl" src={user?.coverImgUrl || "/assets/images/side-image.jpg"} alt="cover photo" />
          </div>
          <div className="h-[100px] w-[100px] md:h-[120px] md:w-[120px] rounded-full absolute left-1/2 -translate-x-1/2 -bottom-14 bg-dark-2">
            <img className="w-full h-full rounded-full border border-light" src={user?.profilePicUrl || "/assets/images/side-image.jpg"} alt="profile pic" />
          </div>

          <div className="w-full flex justify-between items-center mt-6 px-1 sm:px-4">
            <Button
              className="bg-blue hover:bg-blue"
            >
              Follow
            </Button>
            <Button 
              className={cn("hidden bg-blue hover:bg-blue", { "block": myProfile })}
              type="button" 
              onClick={() => navigate(`/edit-profile/${userId}`)}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl">{user?.name} chetachi ogbonna</h2>
            <p className="text-[15px] max-w-[450px] w-[90%] line-clamp-1 text-center">{user?.bio} Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis quo laboriosam eum optio, natus tempore obcaecati praesentium inventore sunt maxime. Magnam alias temporibus repellendus molestias deleniti praesentium quis maiores veniam!
            Voluptas delectus quasi, asperiores perspiciatis cum dignissimos explicabo aliquam reiciendis tenetur dolor recusandae incidunt quaerat praesentium velit accusamus libero rerum quas est laudantium? Repudiandae, labore quibusdam mollitia omnis esse inventore!
            Illo debitis harum excepturi? Ad recusandae placeat dicta quisquam non, nulla voluptatem eaque. Nemo tenetur incidunt exercitationem, error libero repellendus praesentium ratione! Cumque dolorem laborum voluptatem earum maxime doloribus sint!</p>
          </div>
          <div className="flex gap-10 pb-3 justify-center items-center profile-stats">
            <div>
              <p>28</p>
              Following
            </div>

            <div>
              <p>128</p>
              Followers
            </div>
      
            <div>
              <p>128</p>
              Posts
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 w-[98%] mx-auto">
        <h2 className="font-semibold text-[20px] mb-2">Posts</h2>
        <ul 
          className={`${(userPosts as Post[])?.length > 0 && "w-full mx-auto grid max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4"}`}
        >
          {isUserPostsPending
            ? <Loader className="w-full mx-auto" />
            : userPosts && userPosts?.length > 0
              ? userPosts?.map(post => {
                  return (
                    <PostBox post={post} user={user!} isPending={isUserPostsPending} />
                  )
                })
              : <div className="w-full text-center">This user has no post.</div>
            }
        </ul>
      </div>
    </section>
  )
}

export default Profile