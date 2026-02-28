import HomeContainer from "@/widgets/containers/home-page/HomeContainer";
import { FC } from "react";

interface MainRouteProps {}
const HomeRoute: FC<MainRouteProps> = (props) => {
  return (
    <>
      <HomeContainer />
    </>
  );
};
export default HomeRoute;
