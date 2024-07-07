import Container from "../components/custom/container";
import Footer from "../components/Footer";
import JoinUsUnauthorized from "../components/JoinUsUnauthorized";
import useUserAuthStore from "@/stores/useUserAuthStore";
import JoinUsAuthorized from "@/components/JoinUsAuthorized";

const JoinUs = () => {
  const user = useUserAuthStore((state) => state.user);
  return (
    <div className="">
      <Container>
        {user ? (
          <JoinUsAuthorized/>
        ):(
          <JoinUsUnauthorized/>
        )}
        </Container>
        
    <Footer/>
    </div>
  )
}

export default JoinUs