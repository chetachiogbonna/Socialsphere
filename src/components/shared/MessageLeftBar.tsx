import { NavLink, useLocation, useParams } from "react-router-dom"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import { useGetAllUsers, useGetFriendsChats } from "@/react-query"
import Loader from "./Loader"
import useWindowWidth from "@/hooks/useWindowWidth"
import { useUser } from "@/hooks/useUser"

const ChatItem = ({ user }: { user: IUser }) => {
  const { currentUserId } = useUser()

  const chatId = currentUserId! < user?.userId
    ? `${currentUserId}_${user?.userId}` : `${user?.userId}_${currentUserId}`;
  
  const { messages, isPending } = useGetFriendsChats(chatId);

  return (
    <p className="text-gray-400 text-sm line-clamp-1">
     {isPending
        ? "Loading..."
        : messages && messages.length > 0
          ? messages[messages.length - 1].message
          : "No messages yet."
      }
    </p>
  );
}

function MessageLeftBar() {
  const { userId } = useParams()

  const windowWidth = useWindowWidth();
  const{ pathname } = useLocation()

  const { data: users, isPending } = useGetAllUsers();

  const replace = windowWidth > 1024 ? true : false;

  return (
    <aside className={cn("bg-dark-3 [#272F37] h-screen w-full  lg:w-[25%]", { "hidden lg:block": userId })}>
      <div className="mt-4 mx-auto w-[90%] bg-[#424A52] border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-3xl flex items-center pl-2">
        <img className="w-6 h-6 cursor-pointer" src="/assets/icons/search.png" alt="search friend" />
        <Input
          type="text"
          placeholder="Search friends"
          className="bg-[#424A52] border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-3xl"
        />
      </div>

      {isPending 
        ? (
            <Loader className="mx-auto mt-4" />
        ): (
          <ul className="mt-5 mx-auto w-[90%] flex flex-col overflow-y-auto h-screen gap-4">
              {users && users?.length > 0
                ? users?.map(user => {
                    const isActive = pathname === `/messages/${user?.userId}`

                    return (
                      <li key={user.userId} className={cn("hover:bg-light py-3 rounded-xl w-full px-2 cursor-pointer", { "bg-blue hover:bg-blue": isActive })}>
                        <NavLink to={user.userId} className="flex gap-2 h-[40px]" replace={replace}>
                            <img 
                              className="rounded-full object-cover w-10 h-10"
                              src={user.profilePicUrl} 
                              alt="profile pic"
                            />
                          <div className="">
                            <h2>{user.name}</h2>
                            <ChatItem user={user} />
                          </div>
                        </NavLink>
                      </li>
                    )
                  })
                : <div className="text-sm text-gray-400 w-[90%] text-center mx-auto">
                    No user found! Invite your friends to stay connected.
                  </div>
              }
          </ul>
        )
      }
    </aside>
  )
}

export default MessageLeftBar