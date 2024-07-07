import Container from "@/components/custom/container";
import ImageUpload from "@/components/custom/image-upload";
import { useEffect } from "react";
import Select from "react-select";
import useRegionStore from "@/stores/useRegionStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useUserAuthStore from "@/stores/useUserAuthStore";
import useSkillStore from "@/stores/useSkillStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import usePhotoStore from "@/stores/usePhotoStore";
import useTaskStore from "@/stores/useTaskStore";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { TaskRequest } from "@/data/TaskRequest";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  title: z.string().min(1, { message: "*Wpisz tytuł" }),
  description: z.string().min(5, { message: "*Opisz dokładnie zlecenie" }),
  skills: z.array(z.object({ label: z.string(), value: z.number() })),
  region: z.object({ label: z.string(), value: z.number() }),
});

const AddTask = () => {
  const { regions, getRegions } = useRegionStore();
  const { skills, getSkills } = useSkillStore();
  const user = useUserAuthStore((state) => state.user);
  const photos = usePhotoStore((state) => state.photos);
  const { createTask } = useTaskStore();
  const navigate = useNavigate();


  useEffect(() => {
    getRegions();
    getSkills();
  }, [getRegions, getSkills]);

  const regionOptions = regions.map((region) => ({
    label: region.name,
    value: region.id,
  }));

  const skillOptions = skills.map((skill) => ({
    label: skill.name,
    value: skill.id,
  }));

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      skills: [],
      region: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {

    if (!user) {
      console.error("User is not authenticated");
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Musisz być zalogowany, aby dodać zlecenie.",
      });
      return;
    }

    const taskRequest: TaskRequest = {
      clientid: user.id,
      regionid: data.region.value,
      title: data.title,
      description: data.description,
      skills: data.skills.map((skill) => skill.value),
      photos: photos.map((photo) => photo.id),
    };

    try {
      await createTask(taskRequest);
      console.log(taskRequest);
      toast({
        title: "Utworzono zlecenie",
        description: "Pomyślnie utworzono zlecenie",
      });
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="bg-gray-100">
      <Container>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-3 flex flex-col"
          >
            <div className="py-20 space-y-5">
              <h1 className="text-3xl font-semibold text-slate-600">
                Dodaj zlecenie
              </h1>
              <div className="bg-white rounded-md">
                <p className="p-5 font-medium">Dodaj do 5 zdjęć.</p>
                <div className="px-5 min-h-[10rem]">
                  <ImageUpload />
                </div>
              </div>
              <div className="bg-white rounded-md p-5 space-y-3">
                <p className="font-medium">Wybierz region zlecenia</p>
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
              </div>
              <div className="bg-white rounded-md p-5 space-y-3">
                <p className="font-medium">Dodaj tytuł zlecenia</p>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="np. Malowanie ścian" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="font-medium">Dodaj opis zlecenia</p>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="max-h-20"
                          placeholder="Podaj szczegółowy opis zlecenia..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="bg-white rounded-md p-5 space-y-3">
                <p className="font-medium">
                  Wybierz umiejętności potrzebne do wykonania zlecenia
                </p>
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
              </div>
              <div className="px-[30rem]">
              <Button
                type="submit"
                className="w-full uppercase bg-teal-600 hover:bg-white hover:text-teal-600 hover:border-teal-600 hover:border border"
              >
                <Plus className="mr-2 h-4 w-4"/>
                Dodaj
              </Button>
              </div>
            </div>
            
          </form>
        </Form>
      </Container>
    </div>
  );
};

export default AddTask;
