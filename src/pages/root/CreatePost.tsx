import PostForm from "@/components/shared/PostForm";

function CreatePost() {
  return (
    <section className="pt-3 pb-32 md:pb-20">
      <div className="mx-auto mb-6 flex gap-1 items-center w-[98%] md:w-[80%]">
        <img src="/assets/icons/create.png" className="change-icon" width={40} height={40} alt="create post" />
        <h2 className="text-2xl font-medium">Create Post</h2>
      </div>

      <PostForm action="Create" />
      <div className="yes"></div>
    </section>
  )
}

export default CreatePost