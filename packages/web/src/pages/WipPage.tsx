import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { artworksApi, wipApi } from "../api";

const STAGE_COLORS = ["", "#92400E","#B45309","#D97706","#65A30D","#059669"];

export default function WipPage() {
  const [selectedArtwork, setSelectedArtwork] = useState<string>("");

  const { data: artworksRes } = useQuery({ queryKey:["artworks"], queryFn:() => artworksApi.getAll() });
  const { data: wipRes, isLoading } = useQuery({
    queryKey: ["wip", selectedArtwork],
    queryFn: () => wipApi.getAll(selectedArtwork || undefined),
  });

  const artworks: any[] = (artworksRes?.data as any)?.data ?? [];
  const wipItems: any[] = (wipRes?.data as any)?.data ?? [];

  return (
    <>
      <div className="page-header">
        <div><h1>Work-in-Progress</h1><p>Live carving timeline — from raw block to masterpiece</p></div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <select
          className="form-group select"
          style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.9rem", minWidth: 300 }}
          value={selectedArtwork}
          onChange={(e) => setSelectedArtwork(e.target.value)}
        >
          <option value="">— All artworks —</option>
          {artworks.map((a) => (
            <option key={a.id} value={a.id}>{a.title} ({a.productId})</option>
          ))}
        </select>
      </div>

      {isLoading && <div className="loading">Loading timeline…</div>}
      {!isLoading && wipItems.length === 0 && (
        <div className="empty-state">No WIP stages found. Select an artwork above.</div>
      )}

      <div className="timeline">
        {wipItems.map((item) => (
          <div className="timeline-item" key={item.id}>
            <div className="timeline-dot" style={{ background: STAGE_COLORS[item.stage] || "var(--gold)" }} />
            <div className="timeline-content">
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span className="badge" style={{ background: STAGE_COLORS[item.stage]+"22", color: STAGE_COLORS[item.stage], border:`1px solid ${STAGE_COLORS[item.stage]}44` }}>
                  Stage {item.stage} — {item.stageLabel}
                </span>
                <span style={{ fontSize:"0.75rem", color:"var(--muted)" }}>
                  {new Date(item.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                </span>
              </div>
              <h3 style={{ fontFamily:"Playfair Display,serif", fontSize:"1rem" }}>{item.title}</h3>
              <p style={{ color:"var(--muted)", fontSize:"0.875rem", marginTop:6 }}>{item.description}</p>
              <img className="timeline-img" src={item.image} alt={item.title} loading="lazy" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

