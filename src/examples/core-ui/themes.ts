import type { ThemeTokens, UIConfiguration } from "../../core/ui";
import type { BrandName } from "./messages";

export const brands: {
  name: BrandName;
  tokens?: ThemeTokens;
  darkTokens?: ThemeTokens;
  ui?: UIConfiguration;
}[] = [
  { name: "default" },
  {
    name: "ocean",
    tokens: {
      "--core-action-bg": "#0f766e",
      "--core-action-hover": "#115e59",
      "--core-action-fg": "#ffffff",
      "--core-radius": "0.875rem",
      "--core-font-family": "Arial, sans-serif",
      "--core-space": "1.25rem",
      "--core-control-padding": "1.25rem",
      "--core-table-header-bg": "#ccfbf1",
      "--core-table-bg": "#f0fdfa",
      "--core-text": "#134e4a",
      "--core-text-muted": "#115e59",
      "--core-surface": "#f0fdfa",
      "--core-dialog-bg": "#f0fdfa",
    },
    darkTokens: {
      "--core-action-bg": "#5eead4",
      "--core-action-hover": "#99f6e4",
      "--core-action-fg": "#042f2e",
      "--core-surface": "#042f2e",
      "--core-table-bg": "#042f2e",
      "--core-table-header-bg": "#134e4a",
      "--core-text": "#f0fdfa",
      "--core-text-muted": "#99f6e4",
      "--core-dialog-bg": "#042f2e",
    },
    ui: {
      components: {
        Button: { defaultProps: { size: "sm" } },
        Input: { className: "border-2" },
        Dialog: { classNames: { header: "flex-col items-start" } },
        Table: { defaultProps: { density: "compact" } },
      },
    },
  },
  {
    name: "paper",
    tokens: {
      "--core-action-bg": "#92400e",
      "--core-action-hover": "#78350f",
      "--core-action-fg": "#ffffff",
      "--core-radius": "0",
      "--core-font-family": "Georgia, serif",
      "--core-control-height": "3rem",
      "--core-space": "1.5rem",
      "--core-dialog-width": "40rem",
      "--core-table-cell-padding": "1rem 1.5rem",
    },
    darkTokens: {
      "--core-action-bg": "#fcd34d",
      "--core-action-hover": "#fde68a",
      "--core-action-fg": "#1f2937",
    },
    ui: {
      components: {
        Button: {
          defaultProps: { appearance: "outline" },
          className: "tracking-wide",
        },
        Field: { classNames: { label: "font-bold" } },
        Dialog: {
          className: "border-2",
          classNames: { header: "border-b pb-4" },
        },
        Table: { className: "border-2" },
      },
    },
  },
];
