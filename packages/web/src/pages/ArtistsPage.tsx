import { useQuery } from "@tanstack/react-query";
import { artistsApi } from "../api";

export default function ArtistsPage() {
  const { data: res, isLoading } = useQuery({ queryKey: ["artists"], queryFn: () => artistsApi.getAll() });
  const artists: any[] = (res?.data as any)?.data ?? [];

  return (
    <>
      <div className="page-header">
        <div><h1>Artists</h1><p>Verified master craftsmen</p></div>
      </div>
      {isLoading && <div className="loading">Loading artists…</div>}
      <div className="cards-grid">
        {artists.map((a) => (
          <div className="art-card" key={a.id}>
            <img src={a.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"}
              alt={a.name} style={{ height: 180, objectFit: "cover" }} />
            <div className="card-body">
              <div className="card-title">{a.name}</div>
              <div className="card-sub">{a.location}</div>
              <div className="card-sub" style={{ marginTop: 4 }}>
                <span className="badge" style={{ background:"#F5F3EF",color:"var(--muted)" }}>{a.specialization}</span>
                {a.verified && <span className="badge badge-verified" style={{ marginLeft: 6 }}>✓ Verified</span>}
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>
                {a.bio.slice(0, 100)}…
              </p>
              <div style={{ marginTop: 12 }}>
                <a href={`https://wa.me/${a.whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer">
                  <button className="whatsapp-btn" style={{ fontSize: "0.775rem", padding: "7px 14px" }}>
                    💬 WhatsApp
                  </button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

