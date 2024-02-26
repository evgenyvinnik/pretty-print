import "./styles/App.css";
import { useState, useEffect, useRef } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { AppBar, Toolbar } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { isStringNullOrWhitespaceOnly } from "./utils";
import Divider from "@mui/material/Divider";
import { DropZone } from "./DropZone";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string[]>([]);
  const canvasRef = useRef(null);

  useEffect(() => {
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

  const whiteLimit = 230;
  const printCode = (code: string[], ctx: any) => {
    ctx.font = "16px Courier";
    ctx.fillStyle = "#FFF";
    let metrics = ctx.measureText("A");
    const letterHeight =
      metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    const letterWidth = 0; //metrics.width;
    const split = 0;

    let codeWord = 0;
    let x = 0;
    let y = 0;
    let width = ctx.canvas.width;
    let height = ctx.canvas.height;
    let i = 0;
    let j = 0;

    while (i < height) {
      j = 0;
      let wordHeight = 0;
      let wordSplit = 0;
      while (j < width) {
        const pixel = ctx.getImageData(i, j, 1, 1);
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

            x = j;
            y = i;
            ctx.fillText(text, x, y);
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
              setText(
                event.target.value
                  .replace(/\n/g, "")
                  .replace(/ +/g, "\u00a0")
                  .split("\u00a0")
              );
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
              const canvas = canvasRef.current;
              if (canvas != null) {
                const ctx = (canvas as any).getContext("2d", {
                  willReadFrequently: true,
                });
                printCode(text, ctx);
              }
            }}
          >
            Print Code
          </Button>
        </Box>
        <canvas
          id="imageCanvas"
          ref={canvasRef}
          width="1000"
          height="1000"
        ></canvas>
      </Container>
    </div>
  );
}

export default App;
