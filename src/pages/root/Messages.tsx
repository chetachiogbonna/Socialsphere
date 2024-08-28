import Loader from "@/components/shared/Loader";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { useChatFriend, useGetFriendsChats, useGetUserById } from "@/react-query";
import { serverTimestamp } from "firebase/firestore";
import { LucideSendHorizontal } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"

function Messages() {
  const { userId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const { data: user, isPending: isUserPending, error: userError } = useGetUserById(userId as string);

  if (!isUserPending && !user) navigate("/messages");

  const { currentUserId } = useUser()
  const chatContainerRef = useRef() as React.MutableRefObject<HTMLElement>

  const chatId = currentUserId! < user?.userId!
  ? `${currentUserId}_${user?.userId}` 
  : `${user?.userId}_${currentUserId}`;
  
  const { messages, isPending: isGettingMessages } = useGetFriendsChats(chatId);
  
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    chatContainer.scrollTop = chatContainer.scrollHeight
  }, [messages])
 
  const { mutateAsync: sendMessage } = useChatFriend();

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await sendMessage({
      chatId,
      type: "text",
      userId: currentUserId as string,
      message,
      createdAt: serverTimestamp() as unknown as FirestoreTimestamp
    })

    setMessage("")

    if (userError) {
     return toast({
       title: userError.message,
       variant: "destructive"
     })
   }
  }

  return (
    <section className="relative h-screen flex-1">
      <div className="sticky top-[60px] right-0">
        <div className="flex">
          <Link to={`/profile/${userId}`} className="flex items-center gap-2 px-4 h-[60px] min-w-min">
            <img className="rounded-full" width={40} height={40} src={user?.profilePicUrl || "/assets/icons/save.png"} alt="profile pic" />
            
            <div>
              <h2 className="capitalize">{user?.name} destiny ogbonna</h2>
              <h3 className="hover:underline text-gray-600 cursor-pointer">@{user?.name}</h3>
            </div>
          </Link>

          <div />
        </div>
        <hr className="border-[#242A32]" />
      </div>

      <section ref={chatContainerRef} className="overflow-y-auto chat-container pb-28 md:px-14">
        {isGettingMessages
          ? <div className="flex flex-col h-full w-full justify-center items-center">
              <p className="text-lg font-semibold text-center">Getting messages</p>
              <Loader className="mx-auto" />
            </div>
          : messages && messages?.length > 0 ?
              messages?.map(chat => (
                <div className={cn("w-full flex", { "justify-start": userId === chat.userId }, { "justify-end": userId !== chat.userId })}>
                  <div className="p-4 rounded-lg max-w-xs md:max-w-md w-full flex jusitfy-end">
                    <div className="flex mb-2">
                      <div className={cn("", { "comment-box-left": userId === chat.userId }, { "comment-box-right": userId !== chat.userId })}>
                          <p>{chat.message}</p>
                          <span className="text-xs text-gray-300">11:40 PM</span>
                      </div>
                      <div />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col h-full w-full justify-center items-center">
                  <p className="text-lg font-semibold text-center">You have no conversation with this person</p>
                  <p className="text-gray-500 text-center">Be friendly and say hi.</p>
                </div>
              )
        }
      </section>

      <form onSubmit={handleSendMessage} className="sticky bottom-[.5px] w-[98%] mx-auto flex gap-1 items-center bg-[#424A52] rounded-[16px]">
        <div className="ml-2 opacity-60 cursor-pointer">
          🤨
        </div>

        <Input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          placeholder="write something..."
          className="bg-[#424A52] border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-3xl placeholder:text-gray-400"
        />

        <button>
          <LucideSendHorizontal 
            color="#1959FC"
            className="mr-2 cursor-pointer"
          />
        </button>
      </form>
    </section>
  )
}

export default Messages