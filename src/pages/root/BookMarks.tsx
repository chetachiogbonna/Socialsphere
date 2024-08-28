import Loader from '@/components/shared/Loader';
import PostBox from '@/components/shared/PostBox';
import { useUser } from '@/hooks/useUser';
import { useGetUserBookmarkedPosts, useGetUserById } from '@/react-query';

function BookMarks() {
  const { currentUserId } = useUser();

  const { data: user, isPending: isUserPending } = useGetUserById(currentUserId as string)
  const { data: bookmarkedPosts, isPending } = useGetUserBookmarkedPosts(currentUserId as string);

  if (!bookmarkedPosts) {
    <div>No post found</div>
  }

  return (
    <section className="pt-3 pb-28 xl:pb-20">
      <h2 className="w-[90%] md:w-[95%] mx-auto font-bold text-xl mb-8">Bookmarks</h2>
      
      {isPending
        ? <Loader className='mx-auto' />
        : (
          <ul className="w-[90%] md:w-[95%] mx-auto grid max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {bookmarkedPosts?.map(post => (
              <PostBox key={post.postId} post={post} user={user!} isPending={isUserPending || isPending} />
            ))}
          </ul>
        )
      }
    </section>
  )
}

export default BookMarks