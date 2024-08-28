import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Link, useNavigate } from "react-router-dom"
import { LogOut, User } from "lucide-react";
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
import { signOut } from "firebase/auth";
import { auth } from "@/lib/config/firebase";
import Logo from "./Logo";
import { useGetUserById } from "@/react-query";

function TobBarMenu({ setIsUserLoggingOut }: { setIsUserLoggingOut: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { currentUserId } = useUser();
  const { data: user } = useGetUserById(currentUserId as string);

  const [toggleProfileMenu, setToggleProfileMenu] = useState(false);

  return (
    <div className="md:w-52">
      <div 
        className="mt-[10px] flex justify-center items-end gap-3 p-1"
      >
        <div 
          className="cursor-pointer flex justify-center items-end gap-1"
          onMouseOver={() => setToggleProfileMenu(true)}
          onMouseLeave={() => setToggleProfileMenu(false)}
        >
          <img src={user?.profilePicUrl} className="w-8 h-8 rounded-full" alt="" />
          <img src={`/assets/icons/chevron-${toggleProfileMenu ? "up" : "down"} (1).png`} className="w-8 h-8 rounded-full" alt="" />
        </div>
      </div>

      {toggleProfileMenu && 
        <ul 
          className="absolute right-6 top-11 rounded-xl bg-dark-3 flex flex-col items-center z-20 transition-opacity topbar-menu border border-light"
          onMouseOver={() => setToggleProfileMenu(true)}
          onMouseLeave={() => setToggleProfileMenu(false)}
        >
          <li 
            className="mt-5 cursor-pointer hover:bg-light w-full p-2"
            onClick={() => setToggleProfileMenu(false)}
          >
            <Link to={`/profile/${currentUserId}`} className="flex gap-2">
              <User />
              <p className="text-nowrap text-sm">My Profile</p>
            </Link>
          </li>
          <li 
            className="mt-5 cursor-pointer flex gap-2 hover:bg-light w-full p-2 rounded-b-xl"
            onClick={() => setIsUserLoggingOut(true)}
          >
            <LogOut />
            <p>Logout</p>
          </li>
        </ul>
      }
    </div>
  )
}

function TopBar() {
  const navigate = useNavigate();

  const [isUserLoggingOut, setIsUserLoggingOut] = useState(false);

  const handleLogout = () => {
    signOut(auth);
    navigate("/sign-in");
  }

  return (
    <header className="bg-[#1A1A1A] z-10 h-[60px] mb-4 fixed top-0 right-0 left-0">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        <Logo />
        
        <TobBarMenu setIsUserLoggingOut={setIsUserLoggingOut} /> 

        <AlertDialog open={isUserLoggingOut}>
          <AlertDialogContent className="bg-dark-3">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. If you logout, You will lose your account if you can't remember your credentials.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                className="bg-dark-2"
                onClick={() => setIsUserLoggingOut(false)}
              >Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-blue hover:bg-blue"
                onClick={handleLogout}
              >Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  )
}

export default TopBar