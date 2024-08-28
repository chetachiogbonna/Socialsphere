import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import ProfileUploadImage from "./ProfileUploadImage";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { profileSchema } from "@/lib/validation";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { useSetUserProfile } from "@/react-query";
import { useUser } from "@/hooks/useUser";

type SetUserProfileProps = { 
  settingUserProfileReady: boolean,
  setSettingUserProfileReady: Dispatch<SetStateAction<boolean>>,
}

function SetUserProfile({ settingUserProfileReady, setSettingUserProfileReady }: SetUserProfileProps) {
  const navigate = useNavigate();
  const { toast } = useToast()
  const { currentUserId } = useUser()

  const [coverImgFilePath, setCoverImgFilePath] = useState<File>()
  const [profileImgFilePath, setProfilePicFilePath] = useState<File>()

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      coverImgUrl: "",
      profilePicUrl: "",
      bio: ""
    },
  })

  const { mutateAsync: setProfile, isPending, error } = useSetUserProfile();

  if (error) {
    toast({
      title: error.message,
      variant: "destructive",
    })
  }

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    const userProfile = {
      ...values,
      userId: currentUserId as string,
      coverImgFilePath: coverImgFilePath as File,
      profileImgFilePath: profileImgFilePath as File
    }

    await setProfile(userProfile);

    navigate("/")
    toast({
      title: "Profile set successfully.",
    })
    setSettingUserProfileReady(false);
  }

  return (
    <AlertDialog open={settingUserProfileReady}>
      <AlertDialogContent className="bg-dark-3 h-[100dvh] flex flex-col gap-2 max-w-[100vw] md:max-w-[900px] xl:h-[95dvh] overflow-y-auto max-sm:px-2">
        <AlertDialogTitle className="-mt-6">Setup your profile</AlertDialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
            <div className="relative h-[50dvh]">
              <div className="h-full">
                <FormField
                  control={form.control}
                  name="coverImgUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ProfileUploadImage className="border h-[50dvh] bg-dark-5 rounded-3xl border-light focus:ring-offset-dark-2" subClassName="h-full w-full rounded-3xl" field={field.onChange} setImageFilePath={setCoverImgFilePath} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="profilePicUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ProfileUploadImage className="h-[150px] w-[150px] absolute left-10 -bottom-14 bg-dark-5 rounded-full border focus:ring-offset-dark-2 border-light" subClassName="h-full w-full rounded-full" field={field.onChange} setImageFilePath={setProfilePicFilePath} pic={true} />
                      </FormControl>
                      <FormMessage className="mt-32" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-16">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        className="bg-dark-5 border-light focus-visible:ring-offset-1 focus:ring-offset-dark-2 text-white w-full" 
                        placeholder="bio..." {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4 flex justify-end items-center gap-4 h-[10dvh]">
              <Button onClick={() => navigate("/")} className="text-white hover:bg-dark-5 bg-dark-5 hover:text-white">
                Skip
              </Button>
              <Button 
                type="submit"
                className="bg-blue hover:bg-blue"
                disabled={isPending}
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SetUserProfile