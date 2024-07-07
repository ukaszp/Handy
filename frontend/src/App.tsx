import Header from "./components/Header";
import { Toaster } from "./components/ui/toaster";
import JoinUs from "./pages/JoinUs";
import LandingPage from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Route, Routes } from "react-router-dom";
import useUserAuthStore, { useRehydrateAuth } from "./stores/useUserAuthStore";
import AddTask from "./pages/AddTask";
import TasksList from "./pages/TasksList";
import useHandymanStore from "./stores/useHandymanStore";
import { useEffect } from "react";
import { APPLICATION_ROLES } from "./config";
import ShowHandys from "./pages/ShowHandys";
import Messages from "./pages/Messages";
import MyProfile from "./pages/MyProfile";
import AdminPanel from "./pages/adminpanel/AdminPanel";
import HandyProfile from "./components/HandyProfile";
import UserProfile from "./components/UserProfile";

function App() {
  useRehydrateAuth();
  const user = useUserAuthStore((state) => state.user);
  const userRole = useUserAuthStore((state) => state.user?.roleId);
  const {  setCurrentHandyman, currentHandyman} = useHandymanStore();

  useEffect(() => {
    if (user && userRole === APPLICATION_ROLES.HANDYMAN) {
           setCurrentHandyman(user.id);
           console.log("currenthandyman"+currentHandyman);
    }
  }, [setCurrentHandyman, userRole, user]);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/*" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/joinus" element={<JoinUs />} />
        <Route path="/nowezlecenie" element={<AddTask />} />
        <Route path="/tasks" element={<TasksList />} />
        <Route path="/fachowcy" element={<ShowHandys />} />
        <Route path="/chat" element={<Messages />} />
        <Route path="/mojprofil/*" element={<MyProfile />} />
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="/fachowiec/:id/*" element={<HandyProfile />} />
        <Route path="/uzytkownik/:id/*" element={<UserProfile />} />
      </Routes>
      
      <Toaster />
    </div>
  );
}

export default App;
