import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useUserAuthStore from "@/stores/useUserAuthStore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import api from "@/stores/api";
import axios from "axios";

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "Wpisz email",
  }),
  password: z.string().min(2, {
    message: "Wpisz hasło",
  }),
});

export function Login() {
  const login = useUserAuthStore((state) => state.login);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };

      const response = await api.post("/account/login", payload);
        const { user, token } = response.data;
        login(user, token);
        console.log(response);
        console.log("Login successful!", user);
      toast({
        title: "Zalogowano",
        description: "Zostałeś pomyślnie zalogowany.",
      });
      navigate('/')

    } catch (error) {
      let errorMessage = "Wystąpił nieznany błąd";

      if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data.message || errorMessage;
      }
  
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
    }
  }
    

return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 pb-20">
    <div className="mx-4 sm:mx-10 md:mx-20 lg:mx-40 xl:mx-64 flex flex-col items-center bg-white border-teal-600 border-4 rounded-lg max-w-3xl w-full py-6">
      <img src={logo} alt="" className="max-h-20 m-3" />
      <div className="flex space-x-20 text-basic ">
        <div className="px-10 border-b-2 p-3 border-slate-500 rounded-sm">
          Zaloguj się
        </div>
        <Link to="/register" className="px-10 border-b-2 p-3  rounded-sm hover:border-slate-600">
          Załóż konto
        </Link>
      </div>
      <div className="w-full max-w-lg p-3 pt-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-3 flex flex-col"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <Input placeholder="Hasło" {...field} type="password"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="uppercase bg-teal-600 hover:bg-white hover:text-teal-600 hover:border-teal-600 hover:border border"
            >
              Zaloguj
            </Button>
          </form>
        </Form>
      </div>
    </div>
  </div>
);


}
