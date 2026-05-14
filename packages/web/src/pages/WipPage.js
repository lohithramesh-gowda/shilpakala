import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { artworksApi, wipApi } from "../api";
const STAGE_COLORS = ["", "#92400E", "#B45309", "#D97706", "#65A30D", "#059669"];
export default function WipPage() {
    const [selectedArtwork, setSelectedArtwork] = useState("");
    const { data: artworksRes } = useQuery({ queryKey: ["artworks"], queryFn: () => artworksApi.getAll() });
    const { data: wipRes, isLoading } = useQuery({
        queryKey: ["wip", selectedArtwork],
        queryFn: () => wipApi.getAll(selectedArtwork || undefined),
    });
    const artworks = artworksRes?.data?.data ?? [];
    const wipItems = wipRes?.data?.data ?? [];
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "page-header", children: _jsxs("div", { children: [_jsx("h1", { children: "Work-in-Progress" }), _jsx("p", { children: "Live carving timeline \u2014 from raw block to masterpiece" })] }) }), _jsx("div", { style: { marginBottom: 28 }, children: _jsxs("select", { className: "form-group select", style: { padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.9rem", minWidth: 300 }, value: selectedArtwork, onChange: (e) => setSelectedArtwork(e.target.value), children: [_jsx("option", { value: "", children: "\u2014 All artworks \u2014" }), artworks.map((a) => (_jsxs("option", { value: a.id, children: [a.title, " (", a.productId, ")"] }, a.id)))] }) }), isLoading && _jsx("div", { className: "loading", children: "Loading timeline\u2026" }), !isLoading && wipItems.length === 0 && (_jsx("div", { className: "empty-state", children: "No WIP stages found. Select an artwork above." })), _jsx("div", { className: "timeline", children: wipItems.map((item) => (_jsxs("div", { className: "timeline-item", children: [_jsx("div", { className: "timeline-dot", style: { background: STAGE_COLORS[item.stage] || "var(--gold)" } }), _jsxs("div", { className: "timeline-content", children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }, children: [_jsxs("span", { className: "badge", style: { background: STAGE_COLORS[item.stage] + "22", color: STAGE_COLORS[item.stage], border: `1px solid ${STAGE_COLORS[item.stage]}44` }, children: ["Stage ", item.stage, " \u2014 ", item.stageLabel] }), _jsx("span", { style: { fontSize: "0.75rem", color: "var(--muted)" }, children: new Date(item.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) })] }), _jsx("h3", { style: { fontFamily: "Playfair Display,serif", fontSize: "1rem" }, children: item.title }), _jsx("p", { style: { color: "var(--muted)", fontSize: "0.875rem", marginTop: 6 }, children: item.description }), _jsx("img", { className: "timeline-img", src: item.image, alt: item.title, loading: "lazy" })] })] }, item.id))) })] }));
}
