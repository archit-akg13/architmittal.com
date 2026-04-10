/**
 * Shared utility functions for architmittal.com
 * Common helpers for formatting, SEO, and content processing.
 */

/**
 * Format a date string into a human-readable format.
 * @param dateStr - ISO date string (e.g., "2026-04-10")
 * @param locale - Locale for formatting (default: "en-US")
 */
export function formatDate(
    dateStr: string,
    locale: string = "en-US"
  ): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
    });
}

/**
 * Calculate estimated reading time for a block of text.
 * Assumes an average reading speed of 238 words per minute.
 */
export function getReadingTime(text: string): string {
    const WORDS_PER_MINUTE = 238;
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
    return minutes <= 1 ? "1 min read" : `${minutes} min read`;
}

/**
 * Generate a URL-friendly slug from a string.
 */
export function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
}

/**
 * Truncate text to a maximum length, appending ellipsis if needed.
 * Breaks at word boundaries to avoid cutting words.
 */
export function truncate(text: string, maxLength: number = 160): string {
    if (text.length <= maxLength) return text;
    const trimmed = text.slice(0, maxLength);
    const lastSpace = trimmed.lastIndexOf(" ");
    return (lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed) + "...";
}

/**
 * Strip HTML tags from a string for plain-text extraction.
 */
export function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "");
}

/**
 * Generate Open Graph meta description from content.
 * Strips HTML, truncates to 155 chars (OG best practice).
 */
export function generateMetaDescription(content: string): string {
    const plain = stripHtml(content);
    return truncate(plain, 155);
}

/**
 * Create a canonical URL path from segments.
 * Ensures no double slashes and proper leading slash.
 */
export function buildCanonicalPath(...segments: string[]): string {
    const joined = segments
      .map((s) => s.replace(/^\/+|\/+$/g, ""))
      .filter(Boolean)
      .join("/");
    return `/${joined}`;
}

/**
 * Absolute URL builder for SEO and social sharing.
 */
export function absoluteUrl(
    path: string,
    baseUrl: string = "https://architmittal.com"
  ): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
}
