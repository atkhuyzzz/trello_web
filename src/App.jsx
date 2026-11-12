import Board from "./pages/Boards/_id"
import { Routes, Route, Navigate } from "react-router-dom"
import Profile from "~/pages/Users/Profile"
import ProjectsList from "~/pages/Projects"
import NotFound from "~/pages/404/NotFound"
import Auth from "~/pages/Auth/Auth"
import AccountVerification from "~/pages/Auth/AccountVerification"

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to="/boards/6aea26dbb30fa341c96e3ef4" replace={true} />
        }
      />
      //Board Details
      <Route path="/boards/:boardId" element={<Board />} />
      //Authentication
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />
      //Projects
      <Route path="/projects" element={<ProjectsList />} />
      //Profile
      <Route path="/profile" element={<Profile />} />
      //404 not found page
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
