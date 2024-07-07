import MyTasks from "@/components/MyTasks";
import MyUserConflicts from "@/components/MyUserConflicts";
import Container from "@/components/custom/container";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useUserAuthStore from "@/stores/useUserAuthStore";
import { getUserInitials } from "@/utils/userUtils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Route, Routes } from "react-router-dom";

const MyProfile = () => {
  const user = useUserAuthStore((state) => state.user);

  return (
    <div>
      <Container>
        <div className="flex flex-col items-center m-10">
          <Avatar className="w-[15rem] h-[15rem] m-5">
            <AvatarImage src={user?.Avatar} />
            <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold justify-center items-center">{`${user?.name} ${user?.lastName}`}</h1>
          <p>{user?.email}</p>
          {user?.contactNumber && <p>{user?.contactNumber}</p>}
          {user?.dateOfBirth && <p>DOB: {user?.dateOfBirth}</p>}
        </div>
        <div className=" justify-center items-center">
          <Routes>
            <Route path="/" element={<MyTasks />} />
            <Route path="/spory" element={<MyUserConflicts />} />
          </Routes>
        </div>
      </Container>
    </div>
  );
};

export default MyProfile;
