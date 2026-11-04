import Board from "./pages/Boards/_id"
import { Routes, Route, Navigate } from "react-router-dom"
import Login from "~/pages/Auth"
import Profile from "~/pages/Users/Profile"
import VerifyAccount from "~/pages/Auth/VerifyAccount"
import Register from "~/pages/Auth/Register"
import ProjectsList from "~/pages/Projects"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/boards" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/projects" element={<ProjectsList />} />

      <Route path="/boards" element={<Board />} />
      <Route path="/boards/:boardId" element={<Board />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/verify-account" element={<VerifyAccount />} />
    </Routes>
  )
}

export default App
