import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSkillStore from "@/stores/useSkillStore";
import { Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const skillSchema = z.object({
  skillName: z.string().min(1, { message: "Pole nie może być puste" }),
});

type SkillFormValues = z.infer<typeof skillSchema>;

const SkillsList = () => {
  const { createSkill, skills, getSkills, deleteSkill } = useSkillStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
  });

  useEffect(() => {
    getSkills();
  }, [getSkills]);

  const onSubmit = (data: SkillFormValues) => {
    createSkill(data.skillName);
    reset();
  };

  return (
    <div className="m-10 space-y-2">
      <div className="flex flex-col items-center space-y-2">
        <h1 className="uppercase">Dodaj umiejętność</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row items-center space-x-1">
          <Input {...register('skillName')} placeholder="Wprowadź nazwę..." />
          <button type="submit" className="border-2 border-teal-600 h-10 rounded-md">
            <Check className="text-teal-600" />
          </button>
        </form>
        {errors.skillName && <p className="text-red-500">{errors.skillName.message}</p>}
      </div>
      <div className="flex flex-col items-center space-y-2">
        <h1 className="uppercase">Umiejętności:</h1>
        <ScrollArea className="rounded-md border p-4 w-2/5 h-[50rem]">
          {skills.map((skill) => (
            <div key={skill.id} className="flex mx-5">
              <div className="border-2 rounded-md p-2">
                {skill.name}
              </div>
              <button className="border-2 items-center justify-center rounded-md"
                onClick={() => deleteSkill(skill.id)}>
                <X className="text-red-700" />
              </button>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default SkillsList;
