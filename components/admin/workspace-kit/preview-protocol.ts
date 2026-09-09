/** Canvas has mounted and can accept a payload. */
export const PREVIEW_READY = "itfyg:preview-ready";

/** A viewer clicked an editable section in the preview. */
export const PREVIEW_SELECT = "itfyg:preview-select";

/** A debounced draft payload. */
export const PREVIEW_DRAFT = "itfyg:preview-draft";

/** The active section changed in the rail; scroll the preview to match. */
export const PREVIEW_SCROLL = "itfyg:preview-scroll";

export type PreviewReadyMessage = { type: typeof PREVIEW_READY };

export type PreviewSelectMessage = {
  type: typeof PREVIEW_SELECT;
  sectionId: string;
};

export type PreviewDraftMessage<TData> = {
  type: typeof PREVIEW_DRAFT;
  payloadVersion: number;
  activeSectionId: string;
  data: TData;
};

export type PreviewScrollMessage = {
  type: typeof PREVIEW_SCROLL;
  sectionId: string;
};

export type CanvasToParentMessage = PreviewReadyMessage | PreviewSelectMessage;
export type ParentToCanvasMessage<TData> =
  | PreviewDraftMessage<TData>
  | PreviewScrollMessage;

/**
 * The preview is same-origin by construction, so both directions reject any
 * message whose origin is not an exact match.
 */
export function isTrustedPreviewEvent(event: MessageEvent): boolean {
  return event.origin === window.location.origin;
}

/** DOM id of a preview section wrapper, used for scrolling and outlining. */
export function previewSectionDomId(sectionId: string): string {
  return `preview-section-${sectionId}`;
}
