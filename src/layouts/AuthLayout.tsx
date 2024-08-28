import Logo from '@/components/shared/Logo'
import { Outlet, useLocation } from 'react-router-dom'

function AuthLayout() {
  const { pathname } = useLocation();

  return (
    <section className="flex items-center">
      <img
        className='h-screen hidden w-1/2 lg:block'
        src="/assets/images/side-image.jpg" 
        alt="image" 
      />
     
      <div className='flex-1 h-screen flex flex-col gap-6 justify-center items-center overflow-y-auto'>
        <div>
          <div className="pb-8">
            <Logo />
          </div>

          <div>
            {pathname === "/sign-up"
              ? (
                  <div className="flex flex-col justify-center items-center">
                    <h2 className="font-bold text-xl mb-2">
                      Create a new account
                    </h2>
                    <p className="text-sm text-gray-500">To use socialsphere, Please enter your details.</p>
                  </div>
                ): (
                  <div className="flex flex-col justify-center items-center">
                    <h2 className="font-bold text-xl mb-2">
                      Log in to your account
                    </h2>
                    <p className="text-sm text-gray-500">Welcome back! Please enter your details.</p>
                  </div>
              )
            }
          </div>
        </div>

        <Outlet />
      </div>
    </section>
  )
}

export default AuthLayout