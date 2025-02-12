import { AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";
import { useOutlet } from "react-router";
import { cloneElement } from "react";
const AnimatedOutlet = () => {
    const location = useLocation();              // Get current URL
    const element = useOutlet();                // Get current page component
  
    return (
      <AnimatePresence mode="wait" initial={true}>
        {element && cloneElement(element, { key: location.pathname })}
      </AnimatePresence>
    );
  };

export default AnimatedOutlet;