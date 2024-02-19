import { useEffect, useState, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import javascript from "highlight.js/lib/languages/javascript";
import cpp from "highlight.js/lib/languages/cpp";
import java from "highlight.js/lib/languages/java";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { isStringNullOrWhitespaceOnly } from "./utils";

interface CodeHighlighterProps {
  code: string;
}

export const CodeHighlighter = ({ code }: CodeHighlighterProps) => {
  const codeRef = useRef<HTMLElement | null>(null);
  const printRef = useRef(null);

  const [language, setLanguage] = useState("javascript");

  const handleChange = (event: SelectChangeEvent) => {
    const lang = event.target.value as string;
    setLanguage(lang);
  };

  useEffect(() => {
    hljs.registerLanguage("javascript", javascript);
    hljs.registerLanguage("cpp", cpp);
    hljs.registerLanguage("java", java);
  }, []);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute("data-highlighted");
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const copyToClipboard = () => {
    if (codeRef.current) {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(code)
          .then(function () {
            setMessage("Copied to Clipboard!");
            setOpen(true);
          })
          .catch(function () {
            setMessage("Failed to copy to Clipboard!");
            setOpen(true);
          });
      }
    }
  };

  return !isStringNullOrWhitespaceOnly(code) ? (
    <>
      <Container>
        <Box sx={{ mb: 4 }}>
          <Select
            sx={{ mb: 1 }}
            value={language}
            label="Language"
            onChange={handleChange}
          >
            <MenuItem value={"javascript"}>JavaScript</MenuItem>
            <MenuItem value={"cpp"}>C++</MenuItem>
            <MenuItem value={"java"}>Java</MenuItem>
          </Select>
          <Box sx={{ height: "400px", overflow: "scroll" }}>
            <pre style={{}} ref={printRef}>
              <code ref={codeRef} className={`language-${language}`}>
                {code}
              </code>
            </pre>
          </Box>
          <Button
            className="copy-button"
            variant="contained"
            onClick={copyToClipboard}
          >
            Copy to Clipboard
          </Button>
        </Box>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message={message}
        />
      </Container>
    </>
  ) : null;
};
