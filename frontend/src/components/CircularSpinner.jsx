import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

function CircularSpinner() {
  const isLoading = useSelector(state => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "fixed", 
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)", 
        zIndex: 10000, 
      }}
    >
      <CircularProgress size="5rem" />
    </div>
  );
}

export default CircularSpinner;