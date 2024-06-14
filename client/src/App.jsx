import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SocketProvider from "./providers/SocketProvider";
import Auth from "./routes/Auth";
import AuthProviderProtected from './protected-route/AuthProviderProtected';
import AuthProtector from "./protected-route/AuthProtector";
import ProtectedRoute from "./protected-route/ProtectedRoute";
import Welcome from "./routes/Welcome";
import AdminProtected from "./protected-route/AdminProtected";
import Dashboard from "./routes/admin/Dashboard";
import CreatePage from "./routes/admin/CreatePage";
import AdminRAH from "./routes/admin/AdminRAH";
import PrivateStream from "./routes/admin/PrivateStream";
import UserProtected from "./protected-route/UserProtected";
import MainStream from "./routes/user/MainStream";
import PublicStream from "./routes/PublicStream";
import PublicStreamProtected from "./protected-route/PublicStreamProtected";
import Home from './routes/Home';
import JoinWaitlist from './routes/JoinWaitlist';
import ExploreUseCases from './routes/ExploreUseCases';
import AboutUs from './routes/AboutUs';
import Blog from './routes/Blog';
import Blogs from './routes/Blogs';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Home />} />
      <Route path='/join-waitlist' element={<JoinWaitlist />} />
      <Route path='/explore-use-cases' element={<ExploreUseCases />} />
      <Route path='/about-us' element={<AboutUs />} />
      <Route path='/blog' element={<Blogs />} />
      <Route path='/blog/:id' element={<Blog />} />

      <Route element={<AuthProviderProtected />}>
        <Route element={<AuthProtector />}>
          <Route path="/auth" element={<Auth />} />
        </Route>
        <Route element={<PublicStreamProtected />}>
          <Route path="/public-stream/:roomId" element={<PublicStream />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/welcome" element={<Welcome />} />

          <Route element={<AdminProtected />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-page" element={<CreatePage />} />
            <Route path="/private-stream/:roomId" element={<PrivateStream />} />
            <Route
              path="/admin-rah/:roomId"
              element={
                <SocketProvider>
                  <AdminRAH />
                </SocketProvider>
              }
            />
          </Route>
          <Route element={<UserProtected />}>
            <Route
              path="/main-stream/:roomId"
              element={
                <SocketProvider>
                  <MainStream />
                </SocketProvider>
              }
            />
          </Route>
        </Route>
      </Route>

    </>
  )
);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
        }}
      />
    </>
  );
}
