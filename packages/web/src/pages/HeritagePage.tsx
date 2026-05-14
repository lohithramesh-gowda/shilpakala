import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { heritageApi } from "../api";

export default function HeritagePage() {
  const [zoomImg, setZoomImg] = useState<string|null>(null);
  const { data: res, isLoading } = useQuery({ queryKey:["heritage"], queryFn:() => heritageApi.getAll() });
  const stories: any[] = (res?.data as any)?.data ?? [];

  return (
    <>
      <div className="page-header">
        <div><h1>Heritage Stories</h1><p>The living legacy of India's carving traditions</p></div>
      </div>
      {isLoading && <div className="loading">Loading heritage stories…</div>}
      <div style={{ display:"flex", flexDirection:"column", gap:40 }}>
        {stories.map((s) => (
          <div className="heritage-card" key={s.id}>
            <img className="heritage-cover" src={s.coverImage} alt={s.title} />
            <div className="heritage-body">
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                <span className="badge" style={{ background:"#FEF3C7", color:"#92400E" }}>{s.style}</span>
                <span style={{ fontSize:"0.8rem", color:"var(--muted)" }}>{s.period} · {s.region}</span>
              </div>
              <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:"1.6rem" }}>{s.title}</h2>
              <p style={{ color:"var(--muted)", fontStyle:"italic", marginTop:4 }}>{s.subtitle}</p>
              <hr className="divider" />
              <p style={{ whiteSpace:"pre-line", lineHeight:1.8, fontSize:"0.9rem" }}>{s.content}</p>
              <hr className="divider" />
              <h4 style={{ marginBottom:10, fontFamily:"Playfair Display,serif" }}>Key Features</h4>
              <div className="heritage-features">
                {s.keyFeatures.map((f: string, i: number) => (
                  <span key={i} className="feature-tag">✦ {f}</span>
                ))}
              </div>
              {s.gallery.length > 0 && (
                <>
                  <h4 style={{ margin:"24px 0 12px", fontFamily:"Playfair Display,serif" }}>Gallery</h4>
                  <div className="modal-gallery">
                    {s.gallery.map((img: string, i: number) => (
                      <img key={i} src={img} alt={`${s.style} ${i}`} onClick={() => setZoomImg(img)} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {zoomImg && (
        <div className="zoom-overlay" onClick={() => setZoomImg(null)}>
          <button className="zoom-close" onClick={() => setZoomImg(null)}>✕ Close</button>
          <img src={zoomImg} alt="zoomed" />
        </div>
      )}
    </>
  );
}

