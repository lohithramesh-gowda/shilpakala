import { useQuery } from "@tanstack/react-query";
import { artistsApi, artworksApi, inquiriesApi } from "../api";

export default function Dashboard() {
  const { data: artistsRes } = useQuery({ queryKey: ["artists"], queryFn: () => artistsApi.getAll() });
  const { data: artworksRes } = useQuery({ queryKey: ["artworks"], queryFn: () => artworksApi.getAll() });
  const { data: inquiriesRes } = useQuery({ queryKey: ["inquiries"], queryFn: () => inquiriesApi.getAll() });

  const artists  = (artistsRes?.data as any)?.data ?? [];
  const artworks = (artworksRes?.data as any)?.data ?? [];
  const inquiries = (inquiriesRes?.data as any)?.data ?? [];

  const available = artworks.filter((a: any) => a.status === "available").length;
  const wip       = artworks.filter((a: any) => a.status === "wip").length;
  const sold      = artworks.filter((a: any) => a.status === "sold").length;
  const newInq    = inquiries.filter((i: any) => i.status === "new").length;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Welcome to Shilpa-Kala</h1>
          <p>National Heritage Digital Showcase — Admin Portal</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Artists</div>
          <div className="value">{artists.length}</div>
          <div className="sub">Verified craftsmen</div>
        </div>
        <div className="stat-card">
          <div className="label">Artworks Available</div>
          <div className="value">{available}</div>
          <div className="sub">{wip} in progress · {sold} sold</div>
        </div>
        <div className="stat-card">
          <div className="label">New Inquiries</div>
          <div className="value">{newInq}</div>
          <div className="sub">{inquiries.length} total inquiries</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Artworks</div>
          <div className="value">{artworks.length}</div>
          <div className="sub">Across all artists</div>
        </div>
      </div>

      <h2 className="section-title">Recent Artworks</h2>
      <div className="cards-grid">
        {artworks.slice(0, 6).map((art: any) => (
          <div className="art-card" key={art.id}>
            <img src={art.thumbnailImage} alt={art.title} loading="lazy" />
            <div className="card-body">
              <div className="card-title">{art.title}</div>
              <div className="card-sub">{art.style} · {art.material}</div>
              <div className="card-footer">
                <span className={`badge badge-${art.status}`}>{art.status}</span>
                {art.price && <span className="price">₹{art.price.toLocaleString("en-IN")}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

