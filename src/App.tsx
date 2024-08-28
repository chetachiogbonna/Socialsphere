import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import RootLayout from "./layouts/RootLayout";
import MessageLayout from "./layouts/MessageLayout";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import { CreatePost, Home, Profile, Messages, BookMarks, EditPost, PostDetails, People } from "./pages/root";
import NotFound from "./pages/NotFound";
import EditProfile from "./components/shared/EditProfile";
import { loader } from "./lib/utils";

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      {/* auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Route>

      {/* protected routes */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} loader={loader} />
        <Route path="create-post" element={<CreatePost />} loader={loader} />
        <Route path="edit-post/:postId" element={<EditPost />} loader={loader} />
        <Route path="profile/:userId" element={<Profile />} loader={loader} />
        <Route path="post-details/:postId" element={<PostDetails />} loader={loader} />
        <Route path="people" element={<People />} loader={loader} />
        <Route path="bookmarks/:id" element={<BookMarks />} loader={loader} />
        <Route path="edit-profile/:id" element={<EditProfile />} loader={loader} />
      </Route>
      <Route path="/messages" element={<MessageLayout />} loader={loader}>
        <Route path=":userId" element={<Messages />} loader={loader} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </>
  ));

  return (
    <RouterProvider router={router} />
  )
}

export default App
