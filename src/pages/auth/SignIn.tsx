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
import { signInSchema } from '@/lib/validation';
import { useSignInUserAccount } from "@/react-query"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"

function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })
  
  const { mutateAsync: logUserIn, isPending: isLoggingIn, error } = useSignInUserAccount()
  
  async function onSubmit(user: z.infer<typeof signInSchema>) {
    if (error) {
      return toast({
        title: error.message.includes("network")
          ? "Network error! Please check your internet connection" 
          : error.message,
        variant: "destructive"
      })
    }

    await logUserIn(user);

    navigate("/");
    toast({
      title: "Logged in successfully.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-[90%] sm:w-[70%] md:w-1/2 space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input 
                  className="bg-dark-2 border-light focus-visible:ring-offset-1 focus:ring-offset-[#18181B] text-white" 
                  placeholder="email" {...field} 
                />
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
                  className="bg-dark-2 border-light focus-visible:ring-offset-1 focus:ring-offset-[#18181B] text-white" 
                  placeholder="your secret" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit"
          className="w-1/2 bg-blue hover:bg-blue"
          disabled={isLoggingIn}
        >{isLoggingIn ? "Logging In..." : "Log In"}</Button>

        <div className="text-white">
          <p className="text-[15px] text-center font-semibold">
            Don't have an account?            
            <Link to="/sign-up" className="text-blue ml-1 text-nowrap">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </Form>
  )
}

export default SignIn