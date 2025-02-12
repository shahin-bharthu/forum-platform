import { Outlet } from "react-router-dom";
import ClippedDrawer from "./Dashboard/Components/Drawer";
import AnimatedOutlet from "../components/AnimatedOutlet";

function UserRootPage() {
    return <>
    <ClippedDrawer/>
    {/* <Outlet /> */}
    <AnimatedOutlet />
    </>
}

export default UserRootPage;