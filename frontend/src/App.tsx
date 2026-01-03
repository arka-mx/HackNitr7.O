import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import Landing from "@/pages/Landing"
import Dashboard from "@/pages/Dashboard"
import { AuthProvider } from "@/context/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import GuestRoute from "@/components/GuestRoute"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <GuestRoute>
              <LoginForm />
            </GuestRoute>
          } />
          <Route path="/signup" element={
            <GuestRoute>
              <SignupForm />
            </GuestRoute>
          } />
          <Route
            path="/landing"
            element={<Landing />}
          />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
