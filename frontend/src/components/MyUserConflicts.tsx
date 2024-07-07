import { StatusOfTask } from "@/data/StatusOfTask";
import useConflictStore from "@/stores/useConflictStore";
import useHandymanStore from "@/stores/useHandymanStore";
import useUserAuthStore from "@/stores/useUserAuthStore";
import useUserStore from "@/stores/useUserStore";
import { User2Icon } from "lucide-react";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const MyUserConflicts = () => {
  const { conflicts, getUserConflicts, setSelectedConflict } =
    useConflictStore();
  const navigate = useNavigate();
  const { setSelectedUser } = useUserStore();
  const user = useUserAuthStore((state) => state.user);
  const {getHandymanById, selectedHandyman} = useHandymanStore();


  useEffect(() => {
    if (user?.id !== undefined && user?.id !== null) {
      const numericId = Number(user?.id);
      if (!isNaN(numericId)) {
        getUserConflicts(numericId);
      }
    }
  }, [user?.id, getUserConflicts]);


  return (
    <div>
      <div className="flex space-x-20 text-basic justify-center">
        <Link
          className="px-10 border-b-2 p-3 rounded-sm hover:border-slate-600"
          to="/mojprofil"
        >
          Moje zlecenia
        </Link>
        <div className="px-10 border-b-2 p-3 border-slate-500 rounded-sm">
          Spory
        </div>
      </div>
      <div className="my-6 mx-[12rem] py-2 flex justify-center items-center flex-col">
        {conflicts.map((conflict) => (
          <div className="flex space-x-20 py-5" key={conflict.id}>
            <div>{conflict.description}</div>
            <div>
              <div>Status:</div>
              {StatusOfTask[conflict.status]}
            </div>
            <div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyUserConflicts;
