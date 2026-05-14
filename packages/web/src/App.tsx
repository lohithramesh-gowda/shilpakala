import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Image, Users, GitBranch, BookOpen, MessageSquare } from "lucide-react";
import Dashboard  from "./pages/Dashboard";
import ArtworksPage from "./pages/ArtworksPage";
import ArtistsPage  from "./pages/ArtistsPage";
import WipPage       from "./pages/WipPage";
import HeritagePage  from "./pages/HeritagePage";
import InquiriesPage from "./pages/InquiriesPage";

const NAV = [
  { to: "/",          label: "Dashboard",   icon: LayoutDashboard },
  { to: "/artworks",  label: "Artworks",    icon: Image },
  { to: "/artists",   label: "Artists",     icon: Users },
  { to: "/wip",       label: "Work-in-Progress", icon: GitBranch },
  { to: "/heritage",  label: "Heritage",    icon: BookOpen },
  { to: "/inquiries", label: "Inquiries",   icon: MessageSquare },
];

export default function App() {
  const { pathname } = useLocation();
  return (
    <div className="layout">
      {/* Side bar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>🪨 Shilpa-Kala</h2>
          <p>Admin Dashboard</p>
        </div>
        <nav>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="main">
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/artworks"  element={<ArtworksPage />} />
          <Route path="/artists"   element={<ArtistsPage />} />
          <Route path="/wip"       element={<WipPage />} />
          <Route path="/heritage"  element={<HeritagePage />} />
          <Route path="/inquiries" element={<InquiriesPage />} />
        </Routes>
      </main>
    </div>
  );
}

