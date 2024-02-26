import "./styles/App.css";
import { useState, useEffect, useRef, useCallback } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { AppBar, Toolbar } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { isStringNullOrWhitespaceOnly } from "./utils";
import Divider from "@mui/material/Divider";
import { DropZone } from "./DropZone";
import Snackbar from "@mui/material/Snackbar";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const canvasRef = useRef(null);
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

  const HEIGHT = 1000;
  const WIDTH = 1000;

  const printImage = useCallback(() => {
    if (file != null) {
      let reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        if (!!reader.result) {
          const img = new Image();
          img.src = reader.result.toString();
          img.addEventListener("load", () => {
            const canvas = canvasRef.current;
            if (canvas != null) {
              const ctx = (canvas as any).getContext("2d", {
                willReadFrequently: true,
              });
              ctx.fillStyle = "#FFF";
              ctx.fillRect(0, 0, (canvas as any).width, (canvas as any).height);
              var scale = Math.min(
                ctx.canvas.width / img.width,
                ctx.canvas.height / img.height
              ); // get the min scale to fit
              var x = (ctx.canvas.width - img.width * scale) / 2; // centre x
              var y = (ctx.canvas.height - img.height * scale) / 2; // centre y
              ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
          });
        }
      };
    } else {
      const canvas = canvasRef.current;
      if (canvas != null) {
        const ctx = (canvas as any).getContext("2d", {
          willReadFrequently: true,
        });
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, (canvas as any).width, (canvas as any).height);
      }
    }
  }, [file]);

  useEffect(() => {
    printImage();
  }, [file, printImage]);

  const whiteLimit = 230;
  const printCode = (text: string) => {
    if (file == null) {
      setMessage("No image attached");
      setOpen(true);
      return;
    }
    // printImage();
    const canvas = canvasRef.current;
    if (canvas != null) {
      const ctx = (canvas as any).getContext("2d", {
        willReadFrequently: true,
      });
      const code = text
        .replace(/\x28/g, " ( ")
        .replace(/\x29/g, " ) ")
        .replace(/{/g, " { ")
        .replace(/}/g, " } ")
        .replace(/\./g, " . ")
        .replace(/\[/g, " ] ")
        .replace(/\]/g, " [ ")
        .replace(/\|/g, " | ")
        .replace(/=/g, " = ")
        .replace(/\t|\r|\n/g, "\u00a0")
        .replace(/ +/g, "\u00a0")
        .split("\u00a0");

      if (code.length === 0) {
        setMessage("Enter code");
        setOpen(true);
      }

      let list = [];

      let attempts = 0;
      let sizeFont = 18;
      const maxAttempts = 15;

      while (attempts < maxAttempts) {
        ctx.font = `${sizeFont}px Courier`;
        //  ctx.font = `8px Courier`;
        ctx.fillStyle = "#F00";
        let metrics = ctx.measureText("A");
        const letterHeight =
          metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        const letterWidth = metrics.width;
        const split = 2;

        let codeWord = 0;
        let width = ctx.canvas.width;
        let height = ctx.canvas.height;
        let i = 0;
        let j = 0;

        while (i < height) {
          j = 0;
          let wordHeight = 0;
          let wordSplit = 0;
          while (j < width) {
            const pixel = ctx.getImageData(j, i, 1, 1);
            const data = pixel.data;
            let wordLength = 0;
            let wordGap = 0;

            if (
              data[0] < whiteLimit ||
              data[1] < whiteLimit ||
              data[2] < whiteLimit
            ) {
              let text = code[codeWord];
              if (!isStringNullOrWhitespaceOnly(text)) {
                let m = ctx.measureText(text);
                wordLength = m.width;

                wordHeight = letterHeight;
                wordSplit = split;

                wordGap = letterWidth;

                list.push({ text: text, x: j, y: i + wordHeight });
                //ctx.fillText(text, j, i + wordHeight);
              }

              codeWord++;
            }

            j += 1 + wordLength + wordGap;
            if (codeWord === text.length) {
              break;
            }
          }

          i += 1 + wordHeight + wordSplit;
          if (codeWord === text.length) {
            break;
          }
        }
        attempts++;
        if (codeWord !== text.length) {
          setMessage(
            `Attempt ${attempts}: Font too large, reduce to ${sizeFont}`
          );
          setOpen(true);
          sizeFont--;
          if (attempts !== maxAttempts) {
            list = [];
          }
        }
      }
      list.forEach((textElement) => {
        ctx.fillText(textElement.text, textElement.x, textElement.y);
      });
    }
  };

  return (
    <div className="App">
      <AppBar position="sticky">
        <Toolbar>
          Pretty Print: output your code in a truly beautiful way!
        </Toolbar>
      </AppBar>

      <Container>
        <Box sx={{ display: "flex", my: 4 }}>
          <TextField
            label="Enter any text"
            multiline
            fullWidth
            rows={13}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
          />
          <Divider orientation="vertical" variant="middle" flexItem>
            and
          </Divider>
          <Box>
            <DropZone file={file} setFile={setFile} />
          </Box>
        </Box>
      </Container>

      <Container>
        <Box sx={{ my: 4 }}>
          <Button
            sx={{ mt: 1 }}
            className="generate-button"
            variant="contained"
            onClick={() => {
              printCode(text);
            }}
          >
            Print Code
          </Button>
          <Button
            sx={{ mt: 1, mx: 1 }}
            className="generate-button"
            variant="contained"
            onClick={printImage}
          >
            Erase printed code
          </Button>
        </Box>
        <canvas
          id="imageCanvas"
          ref={canvasRef}
          width={`${WIDTH}`}
          height={`${HEIGHT}`}
        ></canvas>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message={message}
        />
      </Container>
    </div>
  );
}

export default App;
