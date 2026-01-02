import type { RouteObject } from "react-router";
import { Landing } from "./views/Landing/Landing";
import { Space } from "./views/Space/Space";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/:spaceId/",
    element: <Space />,
  },
  {
    path: "/:spaceId/list/:listId",
    element: <Space />,
  },
];
