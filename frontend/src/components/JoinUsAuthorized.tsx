import { Link, useNavigate } from "react-router-dom";
import joinusbg from "../assets/joinusbg.jpg";
import { Button } from "./ui/button";
import { z } from "zod";
import { Description } from "@radix-ui/react-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Container from "./custom/container";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import Select from "react-select";
import useRegionStore from "@/stores/useRegionStore";
import useSkillStore from "@/stores/useSkillStore";
import { useEffect } from "react";
import { Plus } from "lucide-react";
import useUserAuthStore from "@/stores/useUserAuthStore";
import useHandymanStore from "@/stores/useHandymanStore";
import { toast } from "./ui/use-toast";
import HandymanRequest from "@/data/HandymanRequest";
import { register } from "module";
import { APPLICATION_ROLES } from "@/config";

const FormSchema = z.object({
  portfoliourl: z.string(),
  description: z.string(),
  skills: z.array(z.object({ label: z.string(), value: z.number() })),
  region: z.object({ label: z.string(), value: z.number() }),
});

const JoinUsUnauthorized = () => {
  const { regions, getRegions } = useRegionStore();
  const { skills, getSkills } = useSkillStore();
  const user = useUserAuthStore((state) => state.user);
  const { registerHandyman } = useHandymanStore();
  const navigate = useNavigate();
  const userRole = useUserAuthStore((state) => state.user?.roleId);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      portfoliourl: "",
      description: "",
      skills: [],
      region: undefined,
    },
  });

  useEffect(() => {
    getRegions();
    getSkills();
  }, []);

  const skillOptions = skills.map((skill) => ({
    label: skill.name,
    value: skill.id,
  }));

  const regionOptions = regions.map((region) => ({
    label: region.name,
    value: region.id,
  }));

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!user) {
      console.error("User is not authenticated");
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Musisz być zalogowany, aby przesłać formularz.",
      });
      return;
    }

    const handymanRequest: HandymanRequest = {
      portfoliourl: data.portfoliourl,
      description: data.description,
      skills: data.skills.map((skill) => skill.value),
      regionid: data.region.value,
      userid: user.id,
    };

    try {
      if (userRole === APPLICATION_ROLES.HANDYMAN) {
        toast({
            variant:"destructive",
            title: "Błąd!",
            description: "Użytkownik jest już zarejestrowany jako fachowiec.",
          });
      } else {
        await registerHandyman(handymanRequest);
        console.log(handymanRequest);
        toast({
          title: "Przesłano",
          description: "Pomyślnie przesłano formularz.",
        });
        navigate("/");
      }
    } catch (error) {
      // Error handling remains the same
    }
  };

  return (
    <div className=" min-h-[38rem]">
      <div
        className="flex flex-col items-center mx-[-19.4rem] p-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.205), rgba(255, 255, 255, 0.226)), url(${joinusbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="mx-[20rem] w-[60rem] bg-white bg-opacity-95 border-teal-600 border-2 rounded-lg p-16 space-y-1 text-lg font-semibold text-slate-600">
          <h1 className="text-4xl font-bold text-teal-600 p-2 pb-10">
            Wypełnij formularz
          </h1>
          <div className="">
            <Container>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-3 flex flex-col"
                >
                  <p className="font-medium">Dodaj opis</p>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            className="max-h-20"
                            placeholder="Przedstaw się, dodaj opis swoich umiejętności..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="font-medium">Dodaj link do strony</p>
                  <FormField
                    control={form.control}
                    name="portfoliourl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="(niewymagane)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="font-medium">Dodaj swoje umiejętności</p>
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            options={skillOptions}
                            placeholder="Wybierz umiejętności..."
                            isMulti
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="font-medium">Wybierz region działania</p>
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            options={regionOptions}
                            placeholder="Wybierz region..."
                            onChange={(option) => field.onChange(option)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full mt-10 uppercase bg-teal-600 hover:bg-white hover:text-teal-600 hover:border-teal-600 hover:border border"
                  >
                    Prześlij formularz
                  </Button>
                </form>
              </Form>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinUsUnauthorized;
