import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { artworksApi, artistsApi } from "../api";
import { ZoomIn, X } from "lucide-react";

export default function ArtworksPage() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<any>(null);
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  const { data: artworksRes, isLoading } = useQuery({
    queryKey: ["artworks"],
    queryFn: () => artworksApi.getAll(),
  });
  const { data: artistsRes } = useQuery({ queryKey: ["artists"], queryFn: () => artistsApi.getAll() });

  const artworks: any[] = (artworksRes?.data as any)?.data ?? [];
  const artists: any[]  = (artistsRes?.data as any)?.data ?? [];

  const getArtist = (id: string) => artists.find((a) => a.id === id);

  const filtered = filter === "all" ? artworks : artworks.filter((a) => a.status === filter);

  return (
    <>
      <div className="page-header">
        <div><h1>Artworks Gallery</h1><p>High-resolution sculpture portfolio</p></div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all","available","wip","sold"].map((f) => (
            <button key={f} className={`btn ${filter === f ? "btn-primary" : "btn-outline"}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="loading">Loading artworks…</div>}

      <div className="cards-grid">
        {filtered.map((art) => (
          <div className="art-card" key={art.id} onClick={() => setSelected(art)}>
            <img src={art.thumbnailImage} alt={art.title} loading="lazy" />
            <div className="card-body">
              <div className="card-title">{art.title}</div>
              <div className="card-sub">{art.style} · {art.material}</div>
              <div className="card-sub" style={{ marginTop: 2 }}>
                🆔 <code style={{ fontSize: "0.7rem" }}>{art.productId}</code>
              </div>
              <div className="card-footer">
                <span className={`badge badge-${art.status}`}>{art.status}</span>
                {art.price && <span className="price">₹{art.price.toLocaleString("en-IN")}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selected.title}</h2>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>
                  {selected.style} · {selected.material}
                  {selected.dimensions ? ` · ${selected.dimensions}` : ""}
                </p>
              </div>
              <button className="btn btn-outline" onClick={() => setSelected(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div>
                <img src={selected.thumbnailImage} alt={selected.title}
                  style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: 6, cursor: "zoom-in" }}
                  onClick={() => setZoomImg(selected.thumbnailImage)} />
                <div className="modal-gallery">
                  {selected.images.map((img: string, i: number) => (
                    <img key={i} src={img} alt={`${selected.title} ${i}`}
                      onClick={() => setZoomImg(img)} />
                  ))}
                </div>
              </div>
              <div>
                <span className={`badge badge-${selected.status}`} style={{ marginBottom: 16 }}>{selected.status}</span>
                <p style={{ marginTop: 8 }}>{selected.description}</p>
                <hr className="divider" />
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.875rem" }}>
                  <div><strong>Product ID:</strong> <code>{selected.productId}</code></div>
                  {selected.price && <div><strong>Price:</strong> <span className="price">₹{selected.price.toLocaleString("en-IN")}</span></div>}
                  {(() => {
                    const artist = getArtist(selected.artistId);
                    return artist ? (
                      <div style={{ marginTop: 8, padding: "12px", background: "var(--cream)", borderRadius: 6 }}>
                        <strong>{artist.name}</strong>
                        <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{artist.location}</div>
                        <a
                          href={`https://wa.me/${artist.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent(`🙏 Hello ${artist.name},\n\nI am interested in:\n*${selected.title}*\nProduct ID: ${selected.productId}\n\nPlease share more details.`)}`}
                          target="_blank" rel="noreferrer" style={{ display: "inline-flex", marginTop: 8 }}>
                          <button className="whatsapp-btn">💬 Enquire on WhatsApp</button>
                        </a>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zoom overlay */}
      {zoomImg && (
        <div className="zoom-overlay" onClick={() => setZoomImg(null)}>
          <button className="zoom-close" onClick={() => setZoomImg(null)}><X size={14} style={{ marginRight: 4 }} />Close</button>
          <img src={zoomImg} alt="zoomed" />
        </div>
      )}
    </>
  );
}

