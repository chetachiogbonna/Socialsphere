import { useGetAllUsers } from "@/react-query"
import { Button } from "../ui/button"

function RightSideBar() {
  const { data: users } = useGetAllUsers()

  return (
    <aside className="hidden xl:block w-[20%] bg-dark-3 absolute right-0 mr-2 pt-4 border border-blue rounded-3xl right-side-bar">
      <ul className="flex flex-col px-4 gap-5">
        {users?.map((user) => {
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
    </aside>
  )
}

export default RightSideBar