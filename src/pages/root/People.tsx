import { useGetAllUsers } from "@/react-query"
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";

function People() {
  const { data: users, isPending: isGettingUser } = useGetAllUsers()

  if (isGettingUser) {
    return (
      <Loader className="mx-auto" />
    )
  }

  return (
    <section className="pt-3 pb-28 xl:pb-20">
      <h2 className="w-[90%] md:w-[95%] mx-auto font-bold text-xl mb-8">People</h2>

      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users?.map(user => {
          return (
            <li className="max-sm:max-h-[400px] max-sm:max-w-[400px] sm:max-h-[350px] sm:max-w-[350px] rounded-2xl relative bg-[#9CA8B2] mx-auto">
              <div className="w-full h-full rounded-2xl px-12 py-6 space-y-2 bg-light">
                <div className="w-16 h-16 rounded-full cursor-pointer bg-dark-3">
                  <img className="w-16 h-16 rounded-full" src={user.profilePicUrl || "/assets/images/copy.png"} alt="user profile" />
                </div>

                <div>
                  <h2>{user.name}</h2>
                  <h3
                    className="hover:underline cursor-pointer text-dark-3 text-[14px]"
                    onClick={() => {}}
                  >@{user.name}</h3>
                </div>

                <Button
                  type="button"
                >Follow</Button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default People