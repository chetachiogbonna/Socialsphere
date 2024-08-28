import BottomBar from '@/components/shared/BottomBar';
import LeftSideBar from '@/components/shared/LeftSideBar';
import TopBar from '@/components/shared/TopBar';
import { Outlet } from 'react-router-dom'

function RootLayout() {
  return (
    <div className="flex justify-center w-full min-h-screen overflow-hidden">
      <div className="max-w-screen-2xl flex w-full relative pt-[60px] md:pl-[25%] xl:pl-[20%]">
        <TopBar />
          <>
            <LeftSideBar />
            <main className="overflow-y-auto h-screen flex-1">
              <Outlet />
            </main>
            <BottomBar /> 
          </>
      </div>
    </div>
  )
}

export default RootLayout