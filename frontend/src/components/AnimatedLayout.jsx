import { Grid2 } from "@mui/material";
import { motion } from "framer-motion";

// Create a motion-enabled version of MUI Grid
const MotionGrid = motion.create(Grid2);


const AnimatedLayout = ({ children, ...gridProps }) => {
  return (
    <MotionGrid
      // Spread any Grid props passed to the component
      {...gridProps}
      // Animation properties
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={{
        hidden: { opacity: 0, x: 0, y: 20 },
        enter: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: 0, y: 20 }
      }}
      transition={{ duration: 0.6, type: "easeInOut" }}
    >
      {children}
    </MotionGrid>
  );
};

export default AnimatedLayout;