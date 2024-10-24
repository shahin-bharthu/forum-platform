import { Outlet } from "react-router-dom";
import ClippedDrawer from "./Dashboard/Components/Drawer";

function UserRootPage() {
    return <>
    <ClippedDrawer/>
    <Outlet />
    </>
}

export default UserRootPage;