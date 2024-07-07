import Container from "@/components/custom/container";
import SideNav from "./SideNav";
import UsersList from "./UsersList";
import { Route, Routes } from "react-router-dom";
import UserProfile from "@/components/UserProfile";
import AdminTasksList from "./AdminTasksList";
import AdminHandysList from "./AdminHandysList";
import SkillsList from "./SkillsList";
import AdminConflicts from "./AdminConflicts";

const AdminPanel = () => (
  <Container>
    <div className="flex h-screen">
      <div className="w-1/4 bg-slate-100 border-2 border-slate-200 last:rounded-md">
        <SideNav />
      </div>
      <div className="w-3/4 bg-white flex flex-col">
        <Routes>
          <Route path="/" element={<UsersList />} />
          <Route path="/tasks/:id" element={<UserProfile />} />
          <Route path="/listazlecen" element={<AdminTasksList />} />
          <Route path="/fachowcy" element={<AdminHandysList />} />
          <Route path="/umiejetnosci" element={<SkillsList />} />
          <Route path="/konflikty" element={<AdminConflicts />} />
        </Routes>
      </div>
    </div>
  </Container>
);

export default AdminPanel;
