/**
 * Type declarations for Masonry jQuery plugin (masonry-layout)
 * @see https://masonry.desandro.com/options.html
 */

interface MasonryOptions {
    /** Selector for item elements. */
    itemSelector?: string;
    /** Column width: number (px), selector string, or element. */
    columnWidth?: number | string;
    /** Horizontal space between items (px or selector). */
    gutter?: number | string;
    /** Use percentage for position. */
    percentPosition?: boolean;
    /** Fit container to width of items. */
    fitWidth?: boolean;
    /** Layout from left. */
    originLeft?: boolean;
    /** Layout from top. */
    originTop?: boolean;
    /** Elements to exclude from layout. */
    stamp?: string;
    /** Transition duration. */
    transitionDuration?: string | number;
}

interface JQuery {
    masonry(options?: MasonryOptions): JQuery;
}
