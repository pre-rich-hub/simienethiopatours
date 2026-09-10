"use client";

import { useEffect, useState } from "react";
import { adminRequestClient } from "@/lib/admin/client";
import {
  LayoutDashboard, Compass, MapPin, Image, Star, BookOpen,
  ClipboardList, Mail, Users,
} from "@/components/admin/ui";

type Stats = {
  totals: {
    tours: number;
    publishedTours: number;
    unpublishedTours: number;
    destinations: number;
    bookings: number;
    contacts: number;
    testimonials: number;
    subscribers: number;
    galleryImages: number;
    blogPosts: number;
  };
  recentBookings: {
    id: number;
    tour: { id: number; name: string } | null;
    fullName: string;
    email: string;
    status: string;
    createdAt: string;
  }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminRequestClient<Stats>("/api/v1/admin/dashboard/stats")
      .then((data) => { if (data) setStats(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (!stats) return <div className="admin-empty">Failed to load dashboard stats.</div>;

  const { totals, recentBookings } = stats;

  const statCards = [
    { label: "Tours", value: totals.tours, detail: `${totals.publishedTours} published, ${totals.unpublishedTours} draft`, icon: Compass },
    { label: "Destinations", value: totals.destinations, icon: MapPin },
    { label: "Gallery", value: totals.galleryImages, icon: Image },
    { label: "Testimonials", value: totals.testimonials, icon: Star },
    { label: "Blog posts", value: totals.blogPosts, detail: "Manage in Blog section", icon: BookOpen },
    { label: "Bookings", value: totals.bookings, icon: ClipboardList },
    { label: "Contacts", value: totals.contacts, icon: Mail },
    { label: "Subscribers", value: totals.subscribers, icon: Users },
  ];

  return (
    <>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="admin-stats">
        {statCards.map((card) => (
          <div key={card.label} className="admin-stat">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="admin-stat__label">{card.label}</span>
              <card.icon size={18} style={{ color: "var(--copper)" }} />
            </div>
            <span className="admin-stat__value">{card.value}</span>
            {card.detail && <span className="admin-stat__detail">{card.detail}</span>}
          </div>
        ))}
      </div>

      <div className="admin-card" style={{ marginBottom: 28 }}>
        <div className="admin-card__header">
          <h2>Quick links</h2>
        </div>
        <div className="admin-card__body">
          <div className="admin-quick-links">
            {[
              { href: "/admin/tours", label: "Manage tours" },
              { href: "/admin/tours/new", label: "New tour" },
              { href: "/admin/destinations", label: "Destinations" },
              { href: "/admin/gallery", label: "Gallery" },
              { href: "/admin/bookings", label: "Bookings" },
              { href: "/admin/blog", label: "Blog posts" },
            ].map((link) => (
              <a key={link.href} href={link.href} className="admin-quick-link">
                <Compass /> {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h2>Recent bookings</h2>
          {totals.bookings > 0 && (
            <a href="/admin/bookings" className="admin-button--link">View all</a>
          )}
        </div>
        <div className="admin-card__body" style={{ padding: 0 }}>
          {recentBookings.length === 0 ? (
            <div className="admin-empty">No bookings yet.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Tour</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.fullName}</td>
                      <td>{b.tour?.name || "—"}</td>
                      <td>
                        <span className={`admin-badge admin-badge--${b.status === "Confirmed" ? "green" : b.status === "Cancelled" ? "red" : "amber"}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
