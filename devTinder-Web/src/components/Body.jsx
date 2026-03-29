import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUser } from "../utils/userSlice";

function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.user);

  const fetchUser = async () => {
    if(userData.name) return;
    try{
        const user = await axios.get(BASE_URL + '/profile',{
        withCredentials: true
      })
      dispatch(setUser(user.data.user));
      navigate('/feed');
    }
    catch (error) {
      if (error.response && error.response.status === 401) {
              localStorage.removeItem("user");
              navigate("/login");
            }
      console.error("Error fetching user:", error);
    }
    
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signUp';

  return (
    <div className="relative min-h-screen ">
      {/* Fixed Navbar */}
      {!isAuthPage && (
        <div className="fixed top-0 left-0 w-full z-50">
          <Nav />
        </div>
      )}
      
      {/* Main Content */}
      <div className={`flex flex-col items-center justify-center ${!isAuthPage ? "pt-[3.5rem] pb-[5rem]" : ""} min-h-screen`}>
        <Outlet />
      </div>

      {/* Fixed Footer */}
      {!isAuthPage && (
        <div className="fixed bottom-0 left-0 w-full z-50">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default Body;