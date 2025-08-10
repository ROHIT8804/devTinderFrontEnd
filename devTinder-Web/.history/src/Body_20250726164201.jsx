import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

function Body() {
  return (
    <div className="relative min-h-screen ">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Nav />
      </div>
      {/* Main Content */}
        <Outlet />
      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <Footer />
      </div>
    </div>
  );
}

export default Body;