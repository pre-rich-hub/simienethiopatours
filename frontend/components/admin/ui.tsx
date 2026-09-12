"use client";

import { Children, cloneElement, isValidElement, useId, type ReactElement, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type CSSProperties } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Compass, MapPin, Image, Star, BookOpen,
  FolderOpen, ClipboardList, Mail, Users, LogOut, ExternalLink,
  ChevronUp, ChevronDown, Trash2, Plus, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function logout() {
  fetch(`${API_BASE}/api/v1/auth/logout`, { method: "POST", credentials: "include" })
    .then(() => { window.location.href = "/admin/login"; })
    .catch(() => { window.location.href = "/admin/login"; });
}

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

const navLinkClass = "flex items-center gap-2.5 rounded px-3.5 py-2.5 text-[13px] font-medium text-stone no-underline transition-colors hover:bg-paper hover:text-ink";
const navLinkActiveClass = "bg-copper/8 text-copper-ink hover:bg-copper/8 hover:text-copper-ink";

export function AdminSidebar({ currentPath }: { currentPath: string }) {
  function isActive(href: string) {
    if (href === "/admin") return currentPath === "/admin";
    return currentPath.startsWith(href);
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col overflow-y-auto border-r border-line bg-ivory md:flex">
      <a href="/admin" className="flex items-center gap-2.5 border-b border-line px-6 py-6 font-serif text-lg font-medium tracking-[-0.02em] text-highland no-underline">
        <span className="text-copper">SET</span> Admin
      </a>
      <nav className="flex flex-1 flex-col gap-0.5 p-3" aria-label="Admin">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={cn(navLinkClass, isActive(item.href) && navLinkActiveClass)}
          >
            <item.icon className="size-[18px]" />
            {item.label}
          </a>
        ))}
      </nav>
      <div className="flex flex-col gap-1 border-t border-line p-3">
        <a href="/" target="_blank" rel="noreferrer" className={navLinkClass}>
          <ExternalLink className="size-[18px]" /> View site
        </a>
        <button type="button" className={navLinkClass} onClick={logout}>
          <LogOut className="size-[18px]" /> Logout
        </button>
      </div>
    </aside>
  );
}

export function AdminTopbar({ userName }: { userName?: string | null }) {
  return (
    <div className="flex items-center justify-end gap-5 border-b border-line bg-ivory px-8 py-4 text-xs">
      {userName && <span className="font-semibold text-ink">{userName}</span>}
      <a href="/" target="_blank" rel="noreferrer" className="text-stone no-underline transition-colors hover:text-copper-ink">View site</a>
      <AdminButton variant="link" onClick={logout}>Logout</AdminButton>
    </div>
  );
}

const adminButtonLook = "rounded-[3px] h-auto min-h-[42px] px-5 text-[11px] font-semibold uppercase tracking-[0.08em] gap-2";
const adminButtonSmall = "min-h-[34px] px-3.5 text-[10px]";

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
  const mapped = variant === "primary" ? "default" : variant === "secondary" ? "outline" : variant === "danger" ? "destructive" : "link";
  return (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      variant={mapped}
      className={cn(
        adminButtonLook,
        size === "small" && adminButtonSmall,
        variant === "primary" && "bg-copper text-white hover:bg-[#9b6439]",
        variant === "secondary" && "border-line bg-transparent text-ink hover:border-stone hover:bg-transparent",
        variant === "link" && "min-h-0 px-0 text-[13px] font-semibold normal-case tracking-normal text-copper-ink hover:underline",
        className,
      )}
    >
      {children}
    </Button>
  );
}

export function adminLinkButtonClass(variant: "primary" | "secondary" = "primary", size: "default" | "small" = "default") {
  return cn(
    buttonVariants({ variant: variant === "primary" ? "default" : "outline", size: "default" }),
    adminButtonLook,
    size === "small" && adminButtonSmall,
    variant === "primary" && "bg-copper text-white hover:bg-[#9b6439]",
    variant === "secondary" && "border-line bg-transparent text-ink hover:border-stone hover:bg-transparent",
  );
}

const fieldControl = "h-auto min-h-[42px] rounded-[3px] border-line bg-white px-3.5 py-2.5 text-sm text-ink focus-visible:border-copper focus-visible:ring-copper/20";

const adminLabelClass = "text-[11px] font-semibold uppercase tracking-[0.08em] text-stone";

type AdminControlProps = {
  id?: string;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-describedby"?: string;
};

export function AdminField({
  label,
  children,
  row,
  error,
  hint,
  className = "",
}: {
  label?: string;
  children: ReactNode;
  row?: boolean;
  error?: string;
  hint?: string;
  className?: string;
}) {
  const generatedId = useId();
  const hintId = `${generatedId}-hint`;
  const errorId = `${generatedId}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;
  const controls = Children.toArray(children).filter(isValidElement);
  const grouped = controls.length > 1;
  const first = controls[0] as ReactElement<AdminControlProps> | undefined;
  const controlId = first?.props.id ?? generatedId;

  const labeled = grouped
    ? children
    : Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        const el = child as ReactElement<AdminControlProps>;
        return cloneElement(el, {
          id: el.props.id ?? generatedId,
          "aria-invalid": error ? true : el.props["aria-invalid"],
          "aria-describedby": [el.props["aria-describedby"], describedBy].filter(Boolean).join(" ") || undefined,
        });
      });

  const message = (
    <>
      {hint && !error && <p id={hintId} className="m-0 text-xs leading-normal text-stone">{hint}</p>}
      {error && <p id={errorId} className="m-0 text-xs leading-normal text-destructive" role="alert">{error}</p>}
    </>
  );

  if (grouped && label) {
    return (
      <fieldset className={cn("m-0 flex min-w-0 flex-col gap-1.5 border-0 p-0", row && "flex-row items-center justify-between", className)}>
        <legend className={cn(adminLabelClass, "float-none w-full px-0")}>{label}</legend>
        {children}
        {message}
      </fieldset>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5", row && "flex-row items-center justify-between", className)}>
      {label && <Label htmlFor={controlId} className={adminLabelClass}>{label}</Label>}
      {labeled}
      {message}
    </div>
  );
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement> & { small?: boolean; readOnly?: boolean }) {
  const { small, readOnly, className = "", ...rest } = props;
  return (
    <Input
      {...rest}
      readOnly={readOnly}
      className={cn(
        fieldControl,
        "w-full",
        small && "max-w-[120px]",
        readOnly && "cursor-default bg-paper text-stone",
        className,
      )}
    />
  );
}

export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return <Textarea {...rest} className={cn(fieldControl, "min-h-[100px] w-full resize-y", className)} />;
}

export function AdminSelect(props: Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & { placeholder?: string }) {
  const { children, placeholder, className = "", ...rest } = props;
  return (
    <NativeSelect {...rest} className={cn("w-full [&_select]:h-auto [&_select]:min-h-[42px] [&_select]:rounded-[3px] [&_select]:border-line [&_select]:bg-white [&_select]:py-2.5 [&_select]:text-sm", className)}>
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </NativeSelect>
  );
}

export function AdminToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-row items-center justify-between gap-1.5">
      {label && <Label htmlFor={id} className={adminLabelClass}>{label}</Label>}
      <Switch id={id} checked={checked} onCheckedChange={onChange} className="data-checked:bg-teal" />
    </div>
  );
}

export function AdminNotice({
  variant = "success",
  children,
  style,
  className,
}: {
  variant?: "success" | "error";
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <Alert
      variant={variant === "error" ? "destructive" : "default"}
      style={style}
      className={cn(
        "rounded-none border-0 border-l-[3px] px-4 py-3 text-[13px] leading-normal",
        variant === "success" && "border-l-teal bg-teal/8 text-highland",
        variant === "error" && "border-l-destructive bg-destructive/8 text-[#8a2319]",
        className,
      )}
    >
      <AlertDescription className={cn("text-[13px]", variant === "success" ? "text-highland" : "text-[#8a2319]")}>{children}</AlertDescription>
    </Alert>
  );
}

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
    <Card className="gap-0 rounded-[3px] border border-line py-0 shadow-none ring-0">
      {(title || actions) && (
        <CardHeader className="flex flex-row items-center justify-between gap-4 rounded-none border-b border-line px-6 py-5">
          {title && <CardTitle className="font-serif text-xl font-medium text-ink">{title}</CardTitle>}
          {actions && <CardAction className="static">{actions}</CardAction>}
        </CardHeader>
      )}
      <CardContent className={flush ? "p-0" : "p-6"}>{children}</CardContent>
    </Card>
  );
}

export function AdminBadge({
  variant = "green",
  children,
}: {
  variant?: "green" | "amber" | "red";
  children: ReactNode;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto rounded-full border-0 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]",
        variant === "green" && "bg-teal/12 text-teal",
        variant === "amber" && "bg-copper/12 text-copper",
        variant === "red" && "bg-destructive/8 text-destructive",
      )}
    >
      {children}
    </Badge>
  );
}

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
    <div className={cn(
      "grid items-start gap-2",
      pair ? "grid-cols-[1fr_1fr_auto]" : "grid-cols-[1fr_auto]",
      day && "flex flex-col gap-3 border border-line bg-white p-5",
    )}>
      {children}
      {(onRemove || onMoveUp || onMoveDown) && (
        <div className="flex gap-1">
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
    <div className="flex gap-2 pt-3">
      <AdminButton variant="secondary" size="small" onClick={onAdd}>
        <Plus size={14} /> {label}
      </AdminButton>
    </div>
  );
}

export function AdminPageHeader({
  title,
  slug,
  actions,
}: {
  title: ReactNode;
  slug?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-7 flex items-center justify-between gap-4">
      <div className="flex items-baseline gap-3">
        <h1 className="m-0 font-serif text-[28px] font-medium leading-[1.15] text-ink">{title}</h1>
        {slug && <span className="text-[13px] text-stone">{slug}</span>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function AdminLoading({ children = "Loading..." }: { children?: ReactNode }) {
  return <div className="grid min-h-[200px] place-items-center p-12 text-center text-sm text-stone">{children}</div>;
}

export function AdminEmpty({ children }: { children: ReactNode }) {
  return <div className="px-6 py-10 text-center text-sm text-stone">{children}</div>;
}

export function AdminError({
  children,
  onRetry,
}: {
  children: ReactNode;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-10 text-center text-sm text-stone">
      <p className="m-0">{children}</p>
      {onRetry && (
        <AdminButton variant="secondary" onClick={onRetry}>
          Try again
        </AdminButton>
      )}
    </div>
  );
}

export function AdminListTable({ headers, children }: { headers: ReactNode[]; children: ReactNode }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {headers.map((header, index) => <AdminTh key={index}>{header}</AdminTh>)}
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  );
}

export function AdminTh({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <TableHead className={cn("h-auto whitespace-nowrap px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-stone", className)}>
      {children}
    </TableHead>
  );
}

export function AdminTd({
  children,
  className,
  slug,
  truncate,
}: {
  children?: ReactNode;
  className?: string;
  slug?: boolean;
  truncate?: boolean;
}) {
  return (
    <TableCell className={cn("px-3.5 py-3 align-middle", slug && "text-xs text-stone", truncate && "max-w-[200px] truncate", className)}>
      {children}
    </TableCell>
  );
}

export {
  Table as AdminTableRoot,
  TableHeader as AdminTableHeader,
  TableBody as AdminTableBody,
  TableRow as AdminTableRow,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
};

export function AdminSearch({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative mb-5 max-w-[360px]">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(fieldControl, "w-full pl-[38px]")}
      />
    </div>
  );
}

export const adminFormGrid = "grid grid-cols-1 gap-5 md:grid-cols-2";
export const adminFormSection = "mb-8";
export const adminFormActions = "flex gap-2 pt-2";
export const adminFileRow = "flex flex-wrap items-end gap-4";
export const adminImagePreview = "h-[100px] w-[160px] border border-line bg-paper object-cover";
export const adminThumb = "h-9 w-12 rounded-[2px] border border-line bg-paper object-cover";
export const adminTableActions = "flex items-center gap-2";
export const adminRepeater = "flex flex-col gap-2";
export const adminFormTitle = "m-0 mb-1 font-serif text-lg font-medium leading-tight text-ink";
export const adminFormDesc = "mb-5 text-[13px] leading-normal text-stone";
export const adminDivider = "my-8 border-0 border-t border-line";
export const adminCheckGrid = "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2";
export const adminCheckbox = "flex cursor-pointer items-center gap-2 border border-line bg-white px-3 py-2 text-[13px] transition-colors hover:border-stone";
export const adminCheckboxChecked = "border-copper bg-copper/4 hover:border-copper";

export function AdminQuickLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 border border-line bg-ivory p-4 text-[13px] font-semibold text-ink no-underline transition-shadow hover:border-copper hover:shadow-[0_2px_8px_rgba(179,119,67,.08)]"
    >
      <Compass className="size-5 shrink-0 text-copper" /> {children}
    </Link>
  );
}

export {
  LayoutDashboard, Compass, MapPin, Image, Star, BookOpen,
  FolderOpen, ClipboardList, Mail, Users, LogOut, ExternalLink,
  ChevronUp, ChevronDown, Trash2, Plus, Search,
};
