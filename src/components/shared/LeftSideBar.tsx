import { leftSideNavLinks } from "@/constants"
import { useUser } from "@/hooks/useUser"
import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"

function LeftSideBar() {
  const { currentUserId } = useUser();
  
  return (
    <aside className="hidden md:block md:w-[25%] xl:w-[20%] absolute left-0 bg-dark-3 top-[60px] h-full pt-6">
      <ul className="flex flex-col px-4 gap-5">
        {leftSideNavLinks.map((link) => {
          return (
            <li key={link.label}>
              {link.id 
                ? (
                  <NavLink
                    to={`${link.route}/${currentUserId}`} 
                    className={({ isActive }) => cn("flex gap-2 w-full items-center p-2 rounded-full link", { "bg-blue link-active": isActive, "hover:bg-light": !isActive })}>
                    <img src={link.image} alt={link.label} className="change-icon-color h-6 w-6" />
                    <div className="text-[13px] text-nowrap">{link.label}</div>
                  </NavLink>
                ) : (
                  <NavLink 
                    to={link.route} 
                    className={({ isActive }) => cn("flex gap-2 hover:bg-blue w-full items-center p-2 rounded-full link", { "bg-blue link-active": isActive, "hover:bg-light": !isActive })}>
                    <img src={link.image} alt={link.label} width={30} height={30} className="change-icon-color h-6 w-6" />
                    <div className="text-[13px] whitespace-nowrap">{link.label}</div>
                  </NavLink>
                )
              }
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default LeftSideBar