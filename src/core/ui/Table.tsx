import { cn } from "../utils/classNames";
import { resolveProps, useCoreUI } from "./configuration";
import type { TableProps } from "./types";

export function TableBase({
  header,
  caption,
  empty,
  emptyContent = "داده‌ای یافت نشد.",
  columnCount = 1,
  density = "comfortable",
  children,
  className,
  classNames,
  ...props
}: TableProps) {
  return (
    <div
      data-slot="viewport"
      className={cn("core-table-viewport", classNames?.viewport)}
    >
      <table
        {...props}
        data-core-component="Table"
        data-slot="root"
        data-density={density}
        className={cn("core-table", classNames?.root, className)}
      >
        {caption && (
          <caption data-slot="caption" className={classNames?.caption}>
            {caption}
          </caption>
        )}
        {header && (
          <thead data-slot="header" className={classNames?.header}>
            <tr>{header}</tr>
          </thead>
        )}
        <tbody data-slot="body" className={classNames?.body}>
          {empty ? (
            <tr>
              <td
                colSpan={columnCount}
                data-slot="empty"
                className={cn("core-table-empty", classNames?.empty)}
              >
                {emptyContent}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
export function Table(props: TableProps) {
  const ui = useCoreUI();
  const View = ui.registry.Table ?? TableBase;
  return <View {...resolveProps(ui.components.Table, props)} />;
}
