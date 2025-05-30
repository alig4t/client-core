import { Button } from "./ui/button";

type buttonTypes = {
  title: string;
};

export default function CustomButton({ title }: buttonTypes) {
  <Button
    variant="secondary"
    className="!bg-none text-sm hover:bg-gray-300 dark:text-gray-800"
  >
    {title}
  </Button>;
}
