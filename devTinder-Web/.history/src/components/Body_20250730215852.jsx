import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

function Body() {
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try{
        const user = await axios.get(BASE_URL + '/profile',{
        withCredentials: true
      })
      dispatch(addUser(user));
    }
    catch (error) {
      console.error("Error fetching user:", error);
    }
    
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="relative min-h-screen ">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Nav />
      </div>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center pt-[3.5rem] pb-[5rem] min-h-screen">
        <Outlet />
      </div>
      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <Footer />
      </div>
    </div>
  );
}

export default Body;