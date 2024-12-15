import Footer from "./components/Footer";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#f5f5dc" }}
    >
      <Header />
      <main className="flex-grow-1 py-3 container">
        <Outlet />
        <ToastContainer />
      </main>
      <Footer />
    </div>
  );
}

export default App;
