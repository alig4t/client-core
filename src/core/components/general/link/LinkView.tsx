import { Link } from "react-router-dom";
import { getViewPath } from "../../../router/RouteUtils";
export default function LinkView({
  viewName,
  id,
  label,
  className = "",
  disabled = false,
}: {
  viewName: string;
  id?: string | number;
  label: string;
  className?: string;
  disabled?: boolean;
}) {
  return disabled ? (
    <span className={className}>{label}</span>
  ) : (
    <Link
      className={"text-blue-600 hover:underline " + className}
      to={getViewPath(viewName, id)}
    >
      {label}
    </Link>
  );
}
