const ErrorFormText: React.FC<{ msg: string }> = ({ msg }) => (
  <p className="mt-1 mr-2 text-xs text-red-400 text-right relative before:absolute before:right-[-8px] before:top-[-1px] before before:content-['*'] before:ml-1 before:mt-1">
    {msg}
  </p>
);

export default ErrorFormText;
