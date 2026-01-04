import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import Landing from "@/pages/Landing"
import Dashboard from "@/pages/Dashboard"
import BillCheck from "@/pages/BillCheck"
import BillSimplifier from "@/pages/BillSimplifier"
import NecessityDetector from "@/pages/NecessityDetector"
import PolicyTrigger from "@/pages/PolicyTrigger"
import CostMeter from "@/pages/CostMeter"
import NotFound from "@/pages/NotFound"
import { AuthProvider } from "@/context/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import GuestRoute from "@/components/GuestRoute"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* <Route path="/" element={
            <GuestRoute>
              <LoginForm />
            </GuestRoute>
          } /> */}
          <Route path="/signup" element={
            <GuestRoute>
              <LoginForm />
            </GuestRoute>
          } />
          <Route
            path="/"
            element={<Landing />}
          />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/bill-check" element={
            <ProtectedRoute>
              <BillCheck />
            </ProtectedRoute>
          } />
          <Route path="/bill-simplifier" element={
            <ProtectedRoute>
              <BillSimplifier />
            </ProtectedRoute>
          } />
          <Route path="/necessity-detector" element={
            <ProtectedRoute>
              <NecessityDetector />
            </ProtectedRoute>
          } />
          <Route path="/policy-trigger" element={
            <ProtectedRoute>
              <PolicyTrigger />
            </ProtectedRoute>
          } />
          <Route path="/cost-meter" element={
            <ProtectedRoute>
              <CostMeter />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
