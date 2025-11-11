import {
  FiCalendar,
  FiFileText,
  FiEdit3,
  FiUser,
  FiMessageSquare,
  FiAlertCircle,
  FiBell,
} from "react-icons/fi";

export const useVetSidebarItems = (currentId) => [
  {
    id: "appointments",
    icon: FiCalendar,
    title: "Manage appointments",
    description: "& schedule",
    path: "/vet-dashboard",
    active: currentId === "appointments",
  },
  {
    id: "medical",
    icon: FiFileText,
    title: "Update pet medical",
    description: "records",
    path: "/vet-dashboard/medical-records",
    active: currentId === "medical",
  },
  {
    id: "prescriptions",
    icon: FiEdit3,
    title: "Issue new prescriptions",
    path: "/vet-dashboard/prescriptions",
    active: currentId === "prescriptions",
  },
  {
    id: "profile",
    icon: FiUser,
    title: "Manage personal profile",
    path: "/vet-dashboard/profile",
    active: currentId === "profile",
  },
  {
    id: "chat",
    icon: FiMessageSquare,
    title: "Chat box",
    badge: 3,
    path: "/vet-dashboard/chat",
    active: currentId === "chat",
  },
  {
    id: "feedback",
    icon: FiAlertCircle,
    title: "Feedback & complaints",
    active: currentId === "feedback",
  },
  {
    id: "notifications",
    icon: FiBell,
    title: "Notifications",
    active: currentId === "notifications",
  },
];
