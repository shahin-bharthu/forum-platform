import { Outlet, useRouteLoaderData } from "react-router-dom";
import ClippedDrawer from "./Dashboard/Components/Drawer";
import { getAuthToken } from "../../utils/auth.js";

function UserRootPage() {
    return <>
    <ClippedDrawer/>
    <Outlet />
    </>
}

export default UserRootPage;