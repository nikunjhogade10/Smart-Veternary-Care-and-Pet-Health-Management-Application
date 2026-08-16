import { createBrowserRouter } from "react-router";
import Splash from "./screens/Splash";
import Login from "./screens/Login";
import AddPet from "./screens/AddPet";
import Dashboard from "./screens/Dashboard";
import Pets from "./screens/Pets";
import Consultation from "./screens/Consultation";
import Shop from "./screens/Shop";
import Records from "./screens/Records";
import VetDetail from "./screens/VetDetail";
import BookAppointment from "./screens/BookAppointment";
import VideoCall from "./screens/VideoCall";
import ChatConsultation from "./screens/ChatConsultation";
import Reminders from "./screens/Reminders";
import NearbyVets from "./screens/NearbyVets";
import Telemedicine from "./screens/Telemedicine";
import Cart from "./screens/Cart";
import Premium from "./screens/Premium";
import Profile from "./screens/Profile";
import About from "./screens/About";
import PaymentMethods from "./screens/PaymentMethods";
import AppointmentHistory from "./screens/AppointmentHistory";
import OrderHistory from "./screens/OrderHistory";
import Settings from "./screens/Settings";
import HelpSupport from "./screens/HelpSupport";
import Peto from "./screens/Peto";
import Community from "./screens/Community";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Splash,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/add-pet",
    Component: AddPet,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/community",
    Component: Community,
  },
  {
    path: "/pets",
    Component: Pets,
  },
  {
    path: "/consultation",
    Component: Consultation,
  },
  {
    path: "/shop",
    Component: Shop,
  },
  {
    path: "/records",
    Component: Records,
  },
  {
    path: "/vet/:id",
    Component: VetDetail,
  },
  {
    path: "/book-appointment/:id",
    Component: BookAppointment,
  },
  {
    path: "/video-call/:id",
    Component: VideoCall,
  },
  {
    path: "/chat/:id",
    Component: ChatConsultation,
  },
  {
    path: "/reminders",
    Component: Reminders,
  },
  {
    path: "/nearby-vets",
    Component: NearbyVets,
  },
  {
    path: "/telemedicine",
    Component: Telemedicine,
  },
  {
    path: "/cart",
    Component: Cart,
  },
  {
    path: "/premium",
    Component: Premium,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/about",
    Component: About,
  },
  {
    path: "/payment-methods",
    Component: PaymentMethods,
  },
  {
    path: "/appointment-history",
    Component: AppointmentHistory,
  },
  {
    path: "/order-history",
    Component: OrderHistory,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/help-support",
    Component: HelpSupport,
  },
  {
    path: "/peto",
    Component: Peto,
  },
]);