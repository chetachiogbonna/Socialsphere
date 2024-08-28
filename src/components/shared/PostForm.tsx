import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createPostSchema } from '@/lib/validation';
import { useCreateNewPost, useUpdatePost } from "@/react-query"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/hooks/useUser"
import { useState } from "react"
import UploadImage from "./UploadImage"
import { Textarea } from "../ui/textarea"
import Loader from "./Loader"
import { serverTimestamp } from "firebase/firestore"

type PostFormProps = {
  post?: INewPost | IEditPost,
  action: "Create" | "Edit"
}

function PostForm({ post, action }: PostFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast()
  const { currentUserId, isLoading } = useUser();
  const [imageFilePath, setImageFilePath] = useState<File>();

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: post?.title || "",
      imageUrl: post?.imageUrl || "",
      location:  post?.location || "",
      tags: post?.tags || "",
    },
  })

  const { mutateAsync: createPost, isPending: isCreatingPost, error: createError } = useCreateNewPost();

  const { mutateAsync: updatePost, isPending: isUpdatingPost, error: updateError } = useUpdatePost()

  if (isLoading) return <Loader className="mx-auto" />

  async function onSubmit(values: z.infer<typeof createPostSchema>) {
    // Creating post
    if (action === "Create") {
      const postValues = {
        ...values,
        imageFilePath: imageFilePath as File,
        userId: currentUserId as string,
        createdAt: serverTimestamp() as unknown as FirestoreTimestamp,
        updatedAt: serverTimestamp() as unknown as FirestoreTimestamp,
        likes: [],
        saves: [],
        comments: []
      }

      await createPost(postValues);

      if (createError) {
        return toast({
          title: createError.message,
          variant: "destructive"
        })
      }


      navigate("/");
      return toast({
        title: "Post created successfully.",
      })
    }  

    // Editing post
    if (action === "Edit" && "postId" in post!) {
      const postValues = {
        ...values,
        imageFilePath: imageFilePath as File,
        userId: currentUserId as string,
        createdAt: post?.createdAt || serverTimestamp(),
        updatedAt: post?.updatedAt || serverTimestamp(),
        likes: post?.likes || [],
        postId: post?.postId,
        saves: post?.saves || [],
        comments: post?.comments || []
      }

      await updatePost(postValues);

      if (updateError) {
        return toast({
          title: updateError.message,
          variant: "destructive"
        })
      }


      navigate(`/post-details/${post.postId}`);
      return toast({
        title: "Post updated successfully.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto space-y-4 w-[98%] md:w-[80%] max-sm:last:mb-14">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Title</FormLabel>
              <FormControl>
                <Textarea 
                  className="bg-[#1A1A1A] border-light focus-visible:ring-offset-1 focus:ring-offset-dark-2 text-white" 
                  placeholder="what's on your mind..." {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Upload Image</FormLabel>
              <FormControl>
                <UploadImage 
                  field={field.onChange}
                  imageUrl={post?.imageUrl}
                  setImageFilePath={setImageFilePath}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Location</FormLabel>
              <FormControl>
                <Input 
                  className="bg-[#1A1A1A] border-light focus-visible:ring-offset-1 focus:ring-offset-dark-3 text-white" 
                  placeholder="location" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Tags</FormLabel>
              <FormControl>
                <Input 
                  className="bg-[#1A1A1A] border-light focus-visible:ring-offset-1 focus:ring-offset-dark-3 text-white" 
                  placeholder="tags" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end items-center gap-3">
          <Button 
            type="reset"
            onClick={() => navigate("/")}
            className="bg-dark-3 hover:bg-dark-3 border border-light px-3 rounded-lg"
          >
            Cancel  
          </Button>
          <Button 
            type="submit"
            className="bg-blue hover:bg-blue transition-colors px-3 rounded-lg"
            disabled={isCreatingPost || isUpdatingPost}
          >{action === "Create" && isCreatingPost 
            ? (
                <>
                  <Loader />
                  Creating...
                </> 
              ) : action === "Edit" && isCreatingPost
              ? (
                <>
                  <Loader />
                  Updating...
                </> 
              ) : action === "Create" && !isCreatingPost 
                  ? "Create" 
                  : action === "Edit" && !isCreatingPost && "Update"
            }</Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm