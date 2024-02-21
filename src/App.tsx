import "./styles/App.css";
import { useState, useEffect, useRef } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { AppBar, Toolbar } from "@mui/material";
import TextField from "@mui/material/TextField";

function App() {
  const [text, setText] = useState<string>("");
  const canvasRef = useRef(null);

  useEffect(() => {
    fetch("/code.txt")
      .then((r) => r.text())
      .then((text) => {
        setText(text.replace(/\n/g, "").replace(/ +/g, "\u00a0"));
      });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas != null) {
      const ctx = (canvas as any).getContext("2d");
      ctx.font = "10px Consolas";
      var txt = "Hello World";
      let metrics = ctx.measureText(txt);
      let fontHeight =
        metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
      let actualHeight =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, (canvas as any).width, (canvas as any).height);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = "https://i.imgur.com/eLZVbQG.png";
      // img.src = "http://www.w3schools.com/tags/img_the_scream.jpg";
      img.addEventListener("load", () => {
        var scale = Math.min(
          ctx.canvas.width / img.width,
          ctx.canvas.height / img.height
        ); // get the min scale to fit
        var x = (ctx.canvas.width - img.width * scale) / 2; // centre x
        var y = (ctx.canvas.height - img.height * scale) / 2; // centre y
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        ctx.fillStyle = "#000";
        ctx.fillText("fontHeight:" + fontHeight, 10, 50);
        ctx.fillText("actualHeight" + actualHeight, 30, 100);
        ctx.fillText("width" + metrics.width, 30, 150);
        ctx.fillText(txt, 10, 200);
      });
    }
  }, [text]);

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
        </Box>
        <canvas
          id="imageCanvas"
          ref={canvasRef}
          width="1000"
          height="1000"
          style={{ border: "1px solid grey" }}
        ></canvas>
      </Container>
    </div>
  );
}

export default App;
