import Backdrop from '@mui/material/Backdrop';
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

function CircularSpinner() {
  const isLoading = useSelector(state => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div
    // style={{
    //   position: "fixed", 
    //   top: "50%",
    //   left: "50%",
    //   transform: "translate(-50%, -50%)", 
    //   zIndex: 10000, 
    // }}
    >
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress size="5rem" />
      </Backdrop>
    </div>
  );
}

export default CircularSpinner;
