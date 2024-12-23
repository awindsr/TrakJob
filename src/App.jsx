import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import supabase from "./utils/Supabase";
import AddJobModal from "./components/AddJobModal";
import Loader from "./components/Loader";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [token, setToken] = useState(null);


  useEffect(() => {
    // Check user authentication status when component mounts
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { user },error
      } = await supabase.auth.getUser();

      if (error) {
        throw new Error(error.message);
      } else if(user) {
        setToken(user.id);
        
        
      }
    } catch (error) {
      console.log("Error getting session:", error);
    } finally {
      setLoading(false); 
    }
  };

  if (loading) {
    return <div className="w-screen h-screen flex items-center justify-center"><Loader/></div>; 
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={token? (
            <Navigate
                to="/dashboard"
               
                token={token}
              />
          ): <Login  setToken={setToken} />}
        />
        {/* Redirect based on authentication status */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate
                to="/dashboard"
               
                token={token}
                setToken={setToken}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/add" element={<AddJobModal token={token} />} />
        <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken}/>} />
      </Routes>
    </Router>
  );
}

export default App;
