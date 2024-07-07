import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, TagIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import { OfferRequest } from "@/data/OfferRequest";
import TasksList from "@/pages/TasksList";
import useUserAuthStore from "@/stores/useUserAuthStore";
import useTaskStore from "@/stores/useTaskStore";
import useHandymanStore from "@/stores/useHandymanStore";
import useOfferStore from "@/stores/useOfferStore";
import { useEffect } from "react";
import { APPLICATION_ROLES } from "@/config";
import { useNavigate } from "react-router-dom";


const FormSchema = z.object({
  price: z.string(),
  estimatedTime: z
    .string()
    .min(1, { message: "*podaj szacowany czas realizacji" }),
  comment: z.string(),
});

const OfferDialog = () => {
  const user = useUserAuthStore((state) => state.user);
  const { selectedTask } = useTaskStore();
  const { currentHandyman} = useHandymanStore();
  const {createOffer} = useOfferStore();
  const navigate = useNavigate();




  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      price: 0,
      estimatedTime: "",
      comment: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!user) {
      console.error("User is not authenticated");
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Musisz być zalogowany, aby dodać oferte.",
      });
      return;
    }
    if (!selectedTask) {
      console.error("Cant find task");
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie znaleziono zlecenia",
      });
      return;
    }
    console.log(currentHandyman)

    if (!currentHandyman) {
      console.error("Cant find handymen");
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Zalogowany użytkownik nie jest fachowcem",
      });
      return;
    }

    const offerRequest: OfferRequest = {
      taskId: selectedTask.id,
      handymanId: currentHandyman.id,
      price: data.price,
      estimatedTime: data.estimatedTime,
      comment: data.comment,
    };

    try {
      await createOffer(offerRequest);
      console.log(offerRequest);
      navigate('/');
    } catch (error) {
      // Error handling remains the same
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" className="bg-teal-600 text-white">
          <TagIcon className="mr-2 h-4 w-4" />
          Złóż ofertę
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Złóż ofertę</DialogTitle>
          <DialogDescription>
            Złóż ofertę na te zlecenie
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-3 flex flex-col"
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">
                  Cena:
                </Label>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">
                  Szacunkowy czas wykonania:
                </Label>
                <FormField
                  control={form.control}
                  name="estimatedTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="np. 2dni" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">
                  Komentarz:
                </Label>
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="komentarz do zleceniodawcy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
        <DialogFooter>
        <Button
                type="submit"
                className="w-full uppercase bg-teal-600 hover:bg-white hover:text-teal-600 hover:border-teal-600 hover:border border"
              >
                <Plus className="mr-2 h-4 w-4"/>
                Złóż ofertę
              </Button>
              
        </DialogFooter>
        
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OfferDialog;
