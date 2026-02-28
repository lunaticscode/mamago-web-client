import { FC, ReactNode } from "react";

interface ContainerProps {
  children?: ReactNode;
}
const Container: FC<ContainerProps> = ({ children }) => {
  return <div className="p-2">{children}</div>;
};

export default Container;
