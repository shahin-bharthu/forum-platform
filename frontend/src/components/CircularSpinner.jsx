import Backdrop from '@mui/material/Backdrop';
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

function CircularSpinner() {
  const isLoading = useSelector(state => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div
    >
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={true}
      >
        <CircularProgress size="5rem" />
      </Backdrop>
    </div>
  );
}

export default CircularSpinner;
