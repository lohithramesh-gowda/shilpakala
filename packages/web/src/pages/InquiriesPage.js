import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inquiriesApi } from "../api";
export default function InquiriesPage() {
    const qc = useQueryClient();
    const { data: res, isLoading } = useQuery({ queryKey: ["inquiries"], queryFn: () => inquiriesApi.getAll() });
    const inquiries = res?.data?.data ?? [];
    const updateMutation = useMutation({
        mutationFn: ({ id, status }) => inquiriesApi.updateStatus(id, status),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["inquiries"] }),
    });
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "page-header", children: _jsxs("div", { children: [_jsx("h1", { children: "Inquiries" }), _jsx("p", { children: "Buyer enquiries for artworks" })] }) }), isLoading && _jsx("div", { className: "loading", children: "Loading inquiries\u2026" }), inquiries.length === 0 && !isLoading && (_jsx("div", { className: "empty-state", children: "No inquiries yet. They will appear here once buyers enquire." })), inquiries.length > 0 && (_jsx("div", { className: "table-wrap", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Buyer" }), _jsx("th", { children: "Product ID" }), _jsx("th", { children: "Message" }), _jsx("th", { children: "Date" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: inquiries.map((inq) => (_jsxs("tr", { children: [_jsxs("td", { children: [_jsx("strong", { children: inq.buyerName }), _jsx("div", { style: { fontSize: "0.75rem", color: "var(--muted)" }, children: inq.buyerEmail })] }), _jsx("td", { children: _jsx("code", { style: { fontSize: "0.75rem" }, children: inq.productId }) }), _jsx("td", { style: { maxWidth: 240, fontSize: "0.8rem" }, children: inq.message }), _jsx("td", { style: { fontSize: "0.8rem", color: "var(--muted)" }, children: new Date(inq.createdAt).toLocaleDateString("en-IN") }), _jsx("td", { children: _jsx("span", { className: `badge badge-${inq.status === "new" ? "available" : inq.status === "closed" ? "sold" : "wip"}`, children: inq.status }) }), _jsx("td", { children: _jsxs("div", { style: { display: "flex", gap: 6 }, children: [inq.status !== "contacted" &&
                                                    _jsx("button", { className: "btn btn-outline", style: { fontSize: "0.75rem", padding: "5px 10px" }, onClick: () => updateMutation.mutate({ id: inq.id, status: "contacted" }), children: "Mark Contacted" }), inq.status !== "closed" &&
                                                    _jsx("button", { className: "btn btn-danger", style: { fontSize: "0.75rem", padding: "5px 10px" }, onClick: () => updateMutation.mutate({ id: inq.id, status: "closed" }), children: "Close" })] }) })] }, inq.id))) })] }) }))] }));
}
