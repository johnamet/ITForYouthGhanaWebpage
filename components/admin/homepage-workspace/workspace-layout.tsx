"use client";

import { WorkspaceShell } from "@/components/admin/workspace-kit/workspace-shell";

import { SectionEditor } from "./section-editor";
import { SectionRail } from "./section-rail";
import { WorkspaceBar } from "./workspace-bar";

export function WorkspaceLayout({ preview }: { preview?: React.ReactNode }) {
  return (
    <WorkspaceShell
      bar={<WorkspaceBar />}
      rail={<SectionRail />}
      editor={<SectionEditor />}
      preview={preview}
    />
  );
}
