import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inquiriesApi } from "../api";

export default function InquiriesPage() {
  const qc = useQueryClient();
  const { data: res, isLoading } = useQuery({ queryKey:["inquiries"], queryFn:() => inquiriesApi.getAll() });
  const inquiries: any[] = (res?.data as any)?.data ?? [];

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => inquiriesApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inquiries"] }),
  });

  return (
    <>
      <div className="page-header">
        <div><h1>Inquiries</h1><p>Buyer enquiries for artworks</p></div>
      </div>
      {isLoading && <div className="loading">Loading inquiries…</div>}
      {inquiries.length === 0 && !isLoading && (
        <div className="empty-state">No inquiries yet. They will appear here once buyers enquire.</div>
      )}
      {inquiries.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Product ID</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id}>
                  <td>
                    <strong>{inq.buyerName}</strong>
                    <div style={{ fontSize:"0.75rem", color:"var(--muted)" }}>{inq.buyerEmail}</div>
                  </td>
                  <td><code style={{ fontSize:"0.75rem" }}>{inq.productId}</code></td>
                  <td style={{ maxWidth:240, fontSize:"0.8rem" }}>{inq.message}</td>
                  <td style={{ fontSize:"0.8rem", color:"var(--muted)" }}>
                    {new Date(inq.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td><span className={`badge badge-${inq.status === "new" ? "available" : inq.status === "closed" ? "sold" : "wip"}`}>{inq.status}</span></td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      {inq.status !== "contacted" &&
                        <button className="btn btn-outline" style={{ fontSize:"0.75rem", padding:"5px 10px" }}
                          onClick={() => updateMutation.mutate({ id: inq.id, status: "contacted" })}>Mark Contacted</button>}
                      {inq.status !== "closed" &&
                        <button className="btn btn-danger" style={{ fontSize:"0.75rem", padding:"5px 10px" }}
                          onClick={() => updateMutation.mutate({ id: inq.id, status: "closed" })}>Close</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

