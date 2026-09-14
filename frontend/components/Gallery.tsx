"use client";

import Image from "@/components/Image";
import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight, X } from "@/components/Icon";
import { type Photograph } from "@/lib/gallery-data";
import { localizePhotograph, photographCategoryKey } from "@/lib/gallery-captions";

const categories = ["all", "landscapes", "wildlife", "culture", "trail"] as const;

export function Gallery({ photographs }: { photographs: readonly Photograph[] }) {
  const t = useTranslations("gallery");
  const locale = useLocale();
  const [category, setCategory] = useState<(typeof categories)[number]>(categories[0]);
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const photos = photographs.map((photo) => localizePhotograph(photo, locale));
  const filtered = photographs
    .map((source, index) => ({ source, photo: photos[index]! }))
    .filter(({ source }) => category === categories[0] || photographCategoryKey(source.category) === category)
    .map(({ photo }) => photo);
  const photo = selected === null ? null : filtered[selected];
  const isOpen = selected !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  function move(direction: number) {
    setSelected((current) => current === null ? null : (current + direction + filtered.length) % filtered.length);
  }

  return <section className="gallery-collection" aria-label={t("galleryAria")}>
    <div className="gallery-toolbar shell">
      <div className="gallery-filters" role="group" aria-label={t("filterAria")}>{categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{t(`filter.${item}`)}</button>)}</div>
      <p className="gallery-count" role="status">{t("count", { count: filtered.length })}</p>
    </div>
    <div className={`gallery-grid ${category !== categories[0] ? "gallery-grid--filtered" : ""}`}>
      {filtered.map((item, index) => <button type="button" className="gallery-tile" key={item.src} onClick={(event) => { triggerRef.current = event.currentTarget; setSelected(index); }} aria-label={t("view", { title: item.title, location: item.location })}>
        <Image src={item.src} alt={item.alt} fill priority={index < 4} sizes={category !== categories[0] ? "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" : index === 7 ? "100vw" : "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"} />
        <span className="gallery-tile__shade" />
        <span className="gallery-tile__category">{item.category}</span>
        <span className="gallery-tile__title">{item.title}</span>
        <span className="gallery-tile__bottom"><span>{item.location}</span><span className="gallery-tile__expand" aria-hidden="true"><ArrowUpRight size={18} /></span></span>
      </button>)}
    </div>
    <div className="gallery-colophon shell"><span>{t("colophon")}</span></div>
    <dialog ref={dialogRef} className="gallery-viewer" aria-labelledby="gallery-photo-title" aria-describedby="gallery-photo-story" onCancel={(event) => { event.preventDefault(); setSelected(null); }} onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }}>
      {photo && <>
        <div className="gallery-viewer__top"><span>{String((selected ?? 0) + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")} <span> · {photo.category}</span></span><button type="button" aria-label={t("close")} onClick={() => setSelected(null)} autoFocus><X size={22} /></button></div>
        <div className="gallery-viewer__image"><Image key={photo.src} src={photo.src} alt={photo.alt} fill sizes="(max-width: 720px) 100vw, 90vw" /></div>
        <div className="gallery-viewer__caption" aria-live="polite" aria-atomic="true"><div><p className="eyebrow">{photo.location}</p><h2 id="gallery-photo-title">{photo.title}</h2><p id="gallery-photo-story">{photo.story}</p><Link className="text-link text-link--light" href={photo.href}>{photo.link} <ArrowUpRight size={15} /></Link></div><div className="gallery-viewer__arrows"><button type="button" aria-label={t("previous")} onClick={() => move(-1)} disabled={filtered.length < 2}><ArrowRight style={{ transform: "rotate(180deg)" }} /></button><button type="button" aria-label={t("next")} onClick={() => move(1)} disabled={filtered.length < 2}><ArrowRight /></button></div></div>
      </>}
    </dialog>
  </section>;
}
