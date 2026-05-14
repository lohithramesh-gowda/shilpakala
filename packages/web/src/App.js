import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Image, Users, GitBranch, BookOpen, MessageSquare } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import ArtworksPage from "./pages/ArtworksPage";
import ArtistsPage from "./pages/ArtistsPage";
import WipPage from "./pages/WipPage";
import HeritagePage from "./pages/HeritagePage";
import InquiriesPage from "./pages/InquiriesPage";
const NAV = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/artworks", label: "Artworks", icon: Image },
    { to: "/artists", label: "Artists", icon: Users },
    { to: "/wip", label: "Work-in-Progress", icon: GitBranch },
    { to: "/heritage", label: "Heritage", icon: BookOpen },
    { to: "/inquiries", label: "Inquiries", icon: MessageSquare },
];
export default function App() {
    const { pathname } = useLocation();
    return (_jsxs("div", { className: "layout", children: [_jsxs("aside", { className: "sidebar", children: [_jsxs("div", { className: "sidebar-logo", children: [_jsx("h2", { children: "\uD83E\uDEA8 Shilpa-Kala" }), _jsx("p", { children: "Admin Dashboard" })] }), _jsx("nav", { children: NAV.map(({ to, label, icon: Icon }) => (_jsxs(NavLink, { to: to, end: to === "/", className: ({ isActive }) => `nav-item${isActive ? " active" : ""}`, children: [_jsx(Icon, { size: 16 }), label] }, to))) })] }), _jsx("main", { className: "main", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/artworks", element: _jsx(ArtworksPage, {}) }), _jsx(Route, { path: "/artists", element: _jsx(ArtistsPage, {}) }), _jsx(Route, { path: "/wip", element: _jsx(WipPage, {}) }), _jsx(Route, { path: "/heritage", element: _jsx(HeritagePage, {}) }), _jsx(Route, { path: "/inquiries", element: _jsx(InquiriesPage, {}) })] }) })] }));
}
