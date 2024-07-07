import useHandymanStore from "@/stores/useHandymanStore";
import { useEffect} from "react";

import { Link } from "react-router-dom";
import useConflictStore from "@/stores/useConflictStore";
import { StatusOfTask } from "@/data/StatusOfTask";

const MyHandymanConflicts = () => {
  const { selectedHandyman, currentHandyman } = useHandymanStore();
  const { conflicts, getHandymenConflicts } =
    useConflictStore();

  useEffect(() => {
    if (currentHandyman?.id !== undefined && currentHandyman?.id !== null) {
      const numericId = Number(currentHandyman?.id);
      if (!isNaN(numericId)) {
        getHandymenConflicts(numericId);
      }
    }
  }, [currentHandyman?.id, getHandymenConflicts]);

  return (
    <div>
      <div className="flex space-x-20 text-basic justify-center">
        <Link
          to={`/fachowiec/${selectedHandyman?.id}`}
          className="px-10 border-b-2 p-3  rounded-sm hover:border-slate-600"
        >
          Opinie
        </Link>
        {currentHandyman?.id === selectedHandyman?.id && (
          <>
            <div className="px-10 border-b-2 p-3 border-slate-500 rounded-sm">
              Spory
            </div>
            <Link
              to={`/fachowiec/${selectedHandyman?.id}/mojeoferty`}
              className="px-10 border-b-2 p-3  rounded-sm hover:border-slate-600"
            >
              Oferty
            </Link>
          </>
        )}
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

export default MyHandymanConflicts;
