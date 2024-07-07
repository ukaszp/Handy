
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import logo from "../assets/logo.png";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import useUserRegistrationStore from "@/stores/useUserRegistrationStore";

const FormSchema = z.object({
  email: z.string().email({ message: "Nieprawidłowy adres e-mail" }).min(1, { message: "E-mail jest wymagany" }),
  name: z.string().min(2, { message: "Imię musi składać się z przynajmniej 2 znaków" }),
  lastname: z.string().min(2, { message: "Nazwisko musi składać się z przynajmniej 2 znaków" }),
  password: z.string().min(6, { message: "Hasło musi składać się z przynajmniej 6 znaków" }),
  confirmpassword: z.string().min(6, { message: "Potwierdzenie hasła musi składać się z przynajmniej 6 znaków" }),
}).refine((data) => data.password === data.confirmpassword, {
  message: "Hasła nie są takie same",
  path: ["confirmpassword"],
});

export function Register() {
  const navigate = useNavigate();
  const { register } = useUserRegistrationStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      name: "",
      lastname: "",
      password: "",
      confirmpassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await register(data);
      console.log(data);
      toast({
        title: "Rejestracja udana!",
        description: "Udało się założyć nowe konto."
      });
      navigate('/login');
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Błąd!",
          description: error.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Błąd",
          description: "Wystąpił nieznany bląd",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pb-20">
      <div className="mx-4 sm:mx-10 md:mx-20 lg:mx-40 xl:mx-64 flex flex-col items-center bg-white border-teal-600 border-4 rounded-lg max-w-3xl w-full py-6">
        
        <img src={logo} alt="" className="max-h-20 m-3" />
        <div className="flex space-x-20 text-basic ">
          <Link
            className="px-10 border-b-2 p-3 rounded-sm hover:border-slate-600"
            to="/login"
          >
            Zaloguj się
          </Link>
          <div className="px-10 border-b-2 p-3 border-slate-500 rounded-sm">
            Załóż konto
          </div>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię</FormLabel>
                    <FormControl>
                      <Input placeholder="Imię" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwisko</FormLabel>
                    <FormControl>
                      <Input placeholder="Nazwisko" {...field} />
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

              <FormField
                control={form.control}
                name="confirmpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Powtórz Hasło</FormLabel>
                    <FormControl>
                      <Input placeholder="Powtórz hasło" {...field} type="password"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="uppercase bg-teal-600 hover:bg-white hover:text-teal-600 hover:border-teal-600 hover:border border"
              >
                Zarejestruj
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}


              
