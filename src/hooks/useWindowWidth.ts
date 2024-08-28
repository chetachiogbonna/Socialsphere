import { useEffect, useState } from 'react'

function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth)
    }

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize)

    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  return windowWidth;
}

export default useWindowWidth