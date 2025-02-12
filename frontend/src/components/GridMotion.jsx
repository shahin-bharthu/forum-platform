import { Box, Grid2} from "@mui/material";
import * as motion from "motion/react-client";

const GridMotion = motion.create(Grid2);
export default function AnimatedGrid({ delay, children }) {
  return (
    <GridMotion
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        delay: (delay+1) * 0.1,
        ease: "easeOut",
      }}
    >
      {children}
    </GridMotion>
  );
}
