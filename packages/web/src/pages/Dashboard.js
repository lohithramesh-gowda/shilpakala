import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { artistsApi, artworksApi, inquiriesApi } from "../api";
export default function Dashboard() {
    const { data: artistsRes } = useQuery({ queryKey: ["artists"], queryFn: () => artistsApi.getAll() });
    const { data: artworksRes } = useQuery({ queryKey: ["artworks"], queryFn: () => artworksApi.getAll() });
    const { data: inquiriesRes } = useQuery({ queryKey: ["inquiries"], queryFn: () => inquiriesApi.getAll() });
    const artists = artistsRes?.data?.data ?? [];
    const artworks = artworksRes?.data?.data ?? [];
    const inquiries = inquiriesRes?.data?.data ?? [];
    const available = artworks.filter((a) => a.status === "available").length;
    const wip = artworks.filter((a) => a.status === "wip").length;
    const sold = artworks.filter((a) => a.status === "sold").length;
    const newInq = inquiries.filter((i) => i.status === "new").length;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "page-header", children: _jsxs("div", { children: [_jsx("h1", { children: "Welcome to Shilpa-Kala" }), _jsx("p", { children: "National Heritage Digital Showcase \u2014 Admin Portal" })] }) }), _jsxs("div", { className: "stats-grid", children: [_jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "label", children: "Total Artists" }), _jsx("div", { className: "value", children: artists.length }), _jsx("div", { className: "sub", children: "Verified craftsmen" })] }), _jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "label", children: "Artworks Available" }), _jsx("div", { className: "value", children: available }), _jsxs("div", { className: "sub", children: [wip, " in progress \u00B7 ", sold, " sold"] })] }), _jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "label", children: "New Inquiries" }), _jsx("div", { className: "value", children: newInq }), _jsxs("div", { className: "sub", children: [inquiries.length, " total inquiries"] })] }), _jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "label", children: "Total Artworks" }), _jsx("div", { className: "value", children: artworks.length }), _jsx("div", { className: "sub", children: "Across all artists" })] })] }), _jsx("h2", { className: "section-title", children: "Recent Artworks" }), _jsx("div", { className: "cards-grid", children: artworks.slice(0, 6).map((art) => (_jsxs("div", { className: "art-card", children: [_jsx("img", { src: art.thumbnailImage, alt: art.title, loading: "lazy" }), _jsxs("div", { className: "card-body", children: [_jsx("div", { className: "card-title", children: art.title }), _jsxs("div", { className: "card-sub", children: [art.style, " \u00B7 ", art.material] }), _jsxs("div", { className: "card-footer", children: [_jsx("span", { className: `badge badge-${art.status}`, children: art.status }), art.price && _jsxs("span", { className: "price", children: ["\u20B9", art.price.toLocaleString("en-IN")] })] })] })] }, art.id))) })] }));
}
