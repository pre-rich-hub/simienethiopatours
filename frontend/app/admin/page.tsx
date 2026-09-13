"use client";

import { useCallback, useEffect, useState } from "react";
import { adminRequestClient } from "@/lib/admin/client";
import {
  Compass, MapPin, Image, Star, BookOpen,
  ClipboardList, Mail, Users,
  AdminPageHeader, AdminLoading, AdminEmpty, AdminError, AdminCard, AdminBadge, AdminQuickLink,
  AdminListTable, AdminTableRow, AdminTd,
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
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    adminRequestClient<Stats>("/api/v1/admin/dashboard/stats")
      .then((data) => { if (data) setStats(data); })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard stats."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <AdminLoading />;
  if (error || !stats) {
    return (
      <>
        <AdminPageHeader title="Dashboard" />
        <AdminError onRetry={load}>{error || "Failed to load dashboard stats."}</AdminError>
      </>
    );
  }

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
      <AdminPageHeader title="Dashboard" />

      <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="flex flex-col gap-1 border border-line bg-ivory p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-[0.08em] text-stone uppercase">{card.label}</span>
              <card.icon size={18} className="text-copper" />
            </div>
            <span className="font-serif text-[32px] leading-tight font-medium text-ink">{card.value}</span>
            {card.detail && <span className="text-xs text-stone">{card.detail}</span>}
          </div>
        ))}
      </div>

      <AdminCard title="Quick links">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          {[
            { href: "/admin/tours", label: "Manage tours" },
            { href: "/admin/tours/new", label: "New tour" },
            { href: "/admin/destinations", label: "Destinations" },
            { href: "/admin/gallery", label: "Gallery" },
            { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/blog", label: "Blog posts" },
    { href: "/admin/translations", label: "Translations" },
          ].map((link) => (
            <AdminQuickLink key={link.href} href={link.href}>{link.label}</AdminQuickLink>
          ))}
        </div>
      </AdminCard>

      <div className="mt-7">
        <AdminCard
          title="Recent bookings"
          actions={totals.bookings > 0 ? <a href="/admin/bookings" className="text-[13px] font-semibold text-copper hover:underline">View all</a> : undefined}
          flush={recentBookings.length > 0}
        >
          {recentBookings.length === 0 ? (
            <AdminEmpty>No bookings yet.</AdminEmpty>
          ) : (
            <AdminListTable headers={["Name", "Tour", "Status", "Date"]}>
              {recentBookings.map((b) => (
                <AdminTableRow key={b.id} className="hover:bg-copper/3">
                  <AdminTd>{b.fullName}</AdminTd>
                  <AdminTd>{b.tour?.name || "—"}</AdminTd>
                  <AdminTd>
                    <AdminBadge variant={b.status === "Confirmed" ? "green" : b.status === "Cancelled" ? "red" : "amber"}>
                      {b.status}
                    </AdminBadge>
                  </AdminTd>
                  <AdminTd>{new Date(b.createdAt).toLocaleDateString()}</AdminTd>
                </AdminTableRow>
              ))}
            </AdminListTable>
          )}
        </AdminCard>
      </div>
    </>
  );
}
