import { Route, Router } from '@solidjs/router'
import RootLayout from '@/routes/__root'
import DashboardPage from '@/routes/dashboard'
import HomePage from '@/routes/index'
import LoginPage from '@/routes/login'

export function AppRouter() {
  return (
    <Router root={RootLayout}>
      <Route path="/" component={HomePage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/login" component={LoginPage} />
    </Router>
  )
}
