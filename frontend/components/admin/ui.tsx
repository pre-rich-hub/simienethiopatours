"use client";

import { type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import {
  LayoutDashboard, Compass, MapPin, Image, Star, BookOpen,
  FolderOpen, ClipboardList, Mail, Users, LogOut, ExternalLink,
  ChevronUp, ChevronDown, Trash2, Plus, Search,
} from "lucide-react";

/* ── Sidebar ──────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Tours", href: "/admin/tours", icon: Compass },
  { label: "Destinations", href: "/admin/destinations", icon: MapPin },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Blog categories", href: "/admin/blog-categories", icon: FolderOpen },
  { label: "Bookings", href: "/admin/bookings", icon: ClipboardList },
  { label: "Contacts", href: "/admin/contacts", icon: Mail },
  { label: "Subscribers", href: "/admin/subscribers", icon: Users },
] as const;

export function AdminSidebar({ currentPath }: { currentPath: string }) {
  function isActive(href: string) {
    if (href === "/admin") return currentPath === "/admin";
    return currentPath.startsWith(href);
  }

  return (
    <aside className="admin-sidebar">
      <a href="/admin" className="admin-sidebar__brand">
        <span>SET</span> Admin
      </a>
      <nav className="admin-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`admin-sidebar__link ${isActive(item.href) ? "admin-sidebar__link--active" : ""}`}
          >
            <item.icon />
            {item.label}
          </a>
        ))}
      </nav>
      <div className="admin-sidebar__footer">
        <a href="/" target="_blank" rel="noreferrer" className="admin-sidebar__link">
          <ExternalLink /> View site
        </a>
        <button
          type="button"
          className="admin-sidebar__link"
          onClick={() => {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            fetch(`${API_BASE}/api/v1/auth/logout`, { method: "POST", credentials: "include" })
              .then(() => { window.location.href = "/admin/login"; })
              .catch(() => { window.location.href = "/admin/login"; });
          }}
        >
          <LogOut /> Logout
        </button>
      </div>
    </aside>
  );
}

/* ── Topbar ───────────────────────────────────────────────────────── */

export function AdminTopbar({ userName }: { userName?: string | null }) {
  return (
    <div className="admin-topbar">
      {userName && <span className="admin-topbar__user">{userName}</span>}
      <a href="/" target="_blank" rel="noreferrer">View site</a>
      <button
        type="button"
        className="admin-button--link"
        onClick={() => {
          const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          fetch(`${API_BASE}/api/v1/auth/logout`, { method: "POST", credentials: "include" })
            .then(() => { window.location.href = "/admin/login"; })
            .catch(() => { window.location.href = "/admin/login"; });
        }}
      >
        Logout
      </button>
    </div>
  );
}

/* ── Button ───────────────────────────────────────────────────────── */

export function AdminButton({
  variant = "primary",
  size = "default",
  disabled,
  onClick,
  type = "button",
  children,
  className = "",
}: {
  variant?: "primary" | "secondary" | "danger" | "link";
  size?: "default" | "small";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`admin-button admin-button--${variant} ${size === "small" ? "admin-button--small" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

/* ── Field / Input / Textarea / Select ────────────────────────────── */

export function AdminField({
  label,
  children,
  row,
  className = "",
}: {
  label?: string;
  children: ReactNode;
  row?: boolean;
  className?: string;
}) {
  return (
    <div className={`admin-field ${row ? "admin-field--row" : ""} ${className}`}>
      {label && <label className="admin-label">{label}</label>}
      {children}
    </div>
  );
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement> & { small?: boolean; readOnly?: boolean }) {
  const { small, readOnly, className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`admin-input ${small ? "admin-input--small" : ""} ${readOnly ? "admin-input--readonly" : ""} ${className}`}
    />
  );
}

export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return <textarea {...rest} className={`admin-textarea ${className}`} />;
}

export function AdminSelect(props: SelectHTMLAttributes<HTMLSelectElement> & { placeholder?: string }) {
  const { children, placeholder, className = "", ...rest } = props;
  return (
    <select {...rest} className={`admin-select ${className}`}>
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
}

/* ── Toggle ───────────────────────────────────────────────────────── */

export function AdminToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <div className="admin-field admin-field--row">
      {label && <label className="admin-label">{label}</label>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className="admin-toggle"
        onClick={() => onChange(!checked)}
      />
    </div>
  );
}

/* ── Notice ───────────────────────────────────────────────────────── */

export function AdminNotice({
  variant = "success",
  children,
  style,
}: {
  variant?: "success" | "error";
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return <div className={`admin-notice admin-notice--${variant}`} style={style}>{children}</div>;
}

/* ── Card ─────────────────────────────────────────────────────────── */

export function AdminCard({
  title,
  children,
  flush,
  actions,
}: {
  title?: string;
  children: ReactNode;
  flush?: boolean;
  actions?: ReactNode;
}) {
  return (
    <div className={`admin-card ${flush ? "admin-card--flush" : ""}`}>
      {(title || actions) && (
        <div className="admin-card__header">
          {title && <h2>{title}</h2>}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="admin-card__body">{children}</div>
    </div>
  );
}

/* ── Badge ────────────────────────────────────────────────────────── */

export function AdminBadge({
  variant = "green",
  children,
}: {
  variant?: "green" | "amber" | "red";
  children: ReactNode;
}) {
  return <span className={`admin-badge admin-badge--${variant}`}>{children}</span>;
}

/* ── Repeater helpers ─────────────────────────────────────────────── */

export function AdminRepeaterItem({
  children,
  pair,
  day,
  onRemove,
  onMoveUp,
  onMoveDown,
  index,
  total,
}: {
  children: ReactNode;
  pair?: boolean;
  day?: boolean;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  index: number;
  total: number;
}) {
  return (
    <div className={`admin-repeater__item ${pair ? "admin-repeater__item--pair" : ""} ${day ? "admin-repeater__item--day" : ""}`}>
      {children}
      {(onRemove || onMoveUp || onMoveDown) && (
        <div className="admin-repeater__reorder">
          {onMoveUp && index > 0 && (
            <AdminButton variant="secondary" size="small" onClick={onMoveUp}>
              <ChevronUp size={14} />
            </AdminButton>
          )}
          {onMoveDown && index < total - 1 && (
            <AdminButton variant="secondary" size="small" onClick={onMoveDown}>
              <ChevronDown size={14} />
            </AdminButton>
          )}
          {onRemove && (
            <AdminButton variant="danger" size="small" onClick={onRemove}>
              <Trash2 size={14} />
            </AdminButton>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminAddRow({ onAdd, label = "Add item" }: { onAdd: () => void; label?: string }) {
  return (
    <div className="admin-add-row">
      <AdminButton variant="secondary" size="small" onClick={onAdd}>
        <Plus size={14} /> {label}
      </AdminButton>
    </div>
  );
}

/* ── Icon re-exports for convenience ──────────────────────────────── */
export {
  LayoutDashboard, Compass, MapPin, Image, Star, BookOpen,
  FolderOpen, ClipboardList, Mail, Users, LogOut, ExternalLink,
  ChevronUp, ChevronDown, Trash2, Plus, Search,
};
