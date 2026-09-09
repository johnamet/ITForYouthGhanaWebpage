"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type PreviewSectionBoundaryProps = {
  label: string;
  /** Changing this clears a previous error so the section can render again. */
  resetKey: number;
  children: ReactNode;
};

type PreviewSectionBoundaryState = { hasError: boolean };

export class PreviewSectionBoundary extends Component<
  PreviewSectionBoundaryProps,
  PreviewSectionBoundaryState
> {
  state: PreviewSectionBoundaryState = { hasError: false };

  static getDerivedStateFromError(): PreviewSectionBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Half-typed draft values produce these legitimately, so this is a console
    // note rather than an error report.
    console.warn(
      `Preview section "${this.props.label}" could not render.`,
      error,
      info,
    );
  }

  componentDidUpdate(previous: PreviewSectionBoundaryProps) {
    // Error boundaries do not self-heal. Without this, a section would stay
    // broken after the editor finished typing a valid value, which reads as a
    // bug in the editor rather than a transient state.
    if (this.state.hasError && previous.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="border-y border-dashed border-brand-border bg-brand-alt px-6 py-10 text-center">
          <p className="font-heading text-lg font-bold text-brand-ink">
            {this.props.label}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            This section can&rsquo;t render with the current values. Keep
            editing &mdash; it reappears as soon as the values are valid.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
