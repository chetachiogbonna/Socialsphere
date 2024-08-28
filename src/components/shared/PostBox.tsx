import { Link } from 'react-router-dom'
import PostStats from './PostStats'

function PostBox({ post, user, isPending }: { post: Post, user: IUser, isPending: boolean }) {
  return (
    <li className="w-full h-80 rounded-2xl relative mx-auto bg-[#A2A4B4]">
      <Link to={`/post-details/${post.postId}`} className="h-full w-full">
        <div className="w-full h-full rounded-2xl">
          <img className="h-full w-full rounded-2xl object-cover" src={post.imageUrl} alt="post image" />
        </div>
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute w-full bottom-1 px-4 pb-3 flex flex-col gap-3 justify-center items-cent">
          <div className="flex gap-2 items-center">
            <img 
              src={user?.profilePicUrl}
              className="w-10 h-10 rounded-full"
              alt="" 
            />
            <p>{user?.name}</p>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <PostStats post={post} showComment={false} isPending={isPending} />
          </div>
        </div>
      </Link>
    </li>
  )
}

export default PostBox