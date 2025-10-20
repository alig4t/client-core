type LabelProps = {
    children:string;
  
  }
const Label = ({children}:LabelProps) => {
  return (<label
    htmlFor={"name"}
    className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-right mb-2 min-h-5"
  >
    {children}
  </label>)
  }

  export default Label;