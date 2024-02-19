import "./styles/App.css";
import { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { CodeHighlighter } from "./CodeHighlighter";

interface CodeHighlighterProps {
  code: string;
}

export const CodeBlock = ({ code }: CodeHighlighterProps) => {
  const [text, setText] = useState<string>(code);

  return (
    <>
      <Container>
        <Box sx={{ my: 4 }}>
          <TextField
            label="Recognized text"
            multiline
            fullWidth
            rows={13}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
          />
        </Box>
      </Container>
      <CodeHighlighter code={text} />
    </>
  );
};
