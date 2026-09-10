"use client";

import { useEffect, useState } from "react";

/**
 * Manages a preview URL for a File object, revoking the previous blob URL
 * on change and on unmount to prevent memory leaks.
 *
 * @param file  - The selected File (or null).
 * @param fallbackUrl - A stable URL string used when no file is selected.
 * @returns The URL to use as an <img> src.
 */
export function useFilePreview(file: File | null, fallbackUrl: string): string {
  const [preview, setPreview] = useState(fallbackUrl);

  useEffect(() => {
    let prev: string | null = null;

    if (file) {
      prev = URL.createObjectURL(file);
      setPreview(prev);
    } else {
      setPreview(fallbackUrl);
    }

    return () => {
      if (prev) URL.revokeObjectURL(prev);
    };
  }, [file, fallbackUrl]);

  return preview;
}
