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
import { signUpSchema } from '@/lib/validation';
import { useSignUpUserAccount } from "@/react-query";
import { Link } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import SetUserProfile from "@/components/shared/SetUserProfile"

function SignUp() {
  const { toast } = useToast()
  const [settingUserProfileReady, setSettingUserProfileReady] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
  })

  const { mutateAsync: signUpUser, isPending: isSigningUp } = useSignUpUserAccount()

  async function onSubmit(user: z.infer<typeof signUpSchema>) {
    const isUserLoggedIn = await signUpUser(user);

    if (!isUserLoggedIn) {
      return toast({
        title: "Failed to sign up. Please try again later.",
        variant: "destructive"
      })
    }

    toast({
      title: "Signed up successfully.",
    })
    
    setSettingUserProfileReady(true)
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(settingUserProfileReady ? () => {} : onSubmit)} 
        className="mx-auto w-[90%] sm:w-[70%] md:w-1/2 space-y-4"
      >
        {settingUserProfileReady === false
            ? (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Name</FormLabel>
                      <FormControl>
                        <Input 
                          type="text"
                          className="bg-dark-2 border-light text-white focus-visible:ring-offset-1 focus:ring-offset-dark-2" 
                          placeholder="name" {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          className="bg-dark-2 border-light text-white focus-visible:ring-offset-1 focus:ring-offset-dark-2" 
                          placeholder="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Username</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          className="bg-dark-2 border-light text-white focus-visible:ring-offset-1 focus:ring-offset-dark-2" 
                          placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          className="bg-dark-2 border-light text-white focus-visible:ring-offset-1 focus:ring-offset-dark-2" 
                          placeholder="your secret" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  className="bg-blue hover:bg-blue w-1/2"
                  disabled={isSigningUp}
                >{isSigningUp ? "Signing Up..." : "Sign Up"}</Button>

                <div className="text-white">
                  <p className="text-[15px] font-semibold text-center">
                    Already have an account? 
                    <Link to="/sign-in" className="text-blue ml-1 text-nowrap">
                      Log in
                    </Link>
                  </p>
                </div>
              </>
            )
          : <SetUserProfile 
              settingUserProfileReady={settingUserProfileReady} 
              setSettingUserProfileReady={setSettingUserProfileReady}
            />
        }
      </form>
    </Form>
  )
}

export default SignUp