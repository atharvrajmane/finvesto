import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./pages/Login";       // You will need to create/have this component
import SignUp from "./pages/SignUp";     // You will need to create/have this component
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Our security guard

function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES WITHIN KITE APP --- */}
      {/* These pages can be seen by anyone, logged in or not. */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* --- PRIVATE/PROTECTED ROUTES --- */}
      {/* The <Home /> component and all its children (Dashboard, Orders, etc.)
          are now wrapped by the ProtectedRoute. A user MUST be logged in
          to see any of these pages. The "/*" ensures that nested routes
          like "/orders" or "/holdings" inside your Dashboard are also protected.
      */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;