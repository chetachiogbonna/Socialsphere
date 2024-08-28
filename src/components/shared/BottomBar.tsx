import { bottomNavLinks } from "@/constants"
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom"

function BottomBar() {
  const { currentUserId } = useUser();

  return (
    <section className="md:hidden fixed bottom-0 right-0 left-0 z-20">
      <ul className="bg-dark-2 h-10 flex justify-between items-center px-5">
        {bottomNavLinks.map((link) => {
          return (
            <li key={link.label}>
              {link.id 
                ? (
                  <NavLink to={`${link.route}/${currentUserId}`} className={({ isActive }) => cn("flex items-center p-2 rounded-md link", { "bg-blue link-active": isActive, "hover:bg-light": !isActive })}>
                    <img src={link.image} alt={link.label} width={20} height={20} className="change-icon-color" />
                  </NavLink>
                ) : (
                  <NavLink to={link.route} className={({ isActive }) => cn("flex hover:bg-blue items-center p-2 rounded-md link", { "bg-blue link-active": isActive, "hover:bg-light": !isActive })}>
                    <img src={link.image} alt={link.label} width={20} height={20} className="change-icon-color" />
                  </NavLink>
                )
              }
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default BottomBar