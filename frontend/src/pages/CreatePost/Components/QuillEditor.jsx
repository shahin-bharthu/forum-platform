import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

const QuillEditor = forwardRef(({ defaultValue }, ref) => {
  const containerRef = useRef(null);
  const defaultValueRef = useRef(defaultValue);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("article")
    );
    const quill = new Quill(editorContainer, {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          ["link", "blockquote", "code-block", { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }, "clean"],
        ],
      },
      placeholder: "Body*",
      theme: "snow",
    });

    ref.current = quill;

    if (defaultValueRef.current) {
      quill.clipboard.dangerouslyPasteHTML(defaultValueRef.current);
    }

    return () => {
      ref.current = null;
      container.innerHTML = "";
    };
  }, [ref]);

  useEffect(() => {
    if (defaultValue && ref.current) {
      // Handle updates to defaultValue (HTML string from DB)
      ref.current.clipboard.dangerouslyPasteHTML(defaultValue);
    }
  }, [defaultValue]);

  return (
    <Box
      sx={{
        mt: 3,
        mb: { xs: 1, sm: 5 }, 
        height: { xs: "100%", sm: "160px"},
        width: { xs: "100%", sm: "100%", md: "70ch"},
      }}
      ref={containerRef}
    ></Box>
  );
});

QuillEditor.displayName = "Editor";

export default QuillEditor;

// QuillEditor.propTypes = {
//   defaultValue: PropTypes.oneOfType([
//     PropTypes.string   // HTML string
//   ]),
// };
