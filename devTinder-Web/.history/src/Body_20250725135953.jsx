function Body() {
  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Nav />
      <div className="flex-1 container mx-auto p-4">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Body;