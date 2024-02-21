import "./styles/App.css";
import { useState, useEffect, useRef } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { AppBar, Toolbar } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { isStringNullOrWhitespaceOnly } from "./utils";

function App() {
  const [text, setText] = useState<string[]>([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const code = `"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractComputedKeys = extractComputedKeys;
exports.injectInitialization = injectInitialization;
var _core = require("@babel/core");
var _helperEnvironmentVisitor = require("@babel/helper-environment-visitor");
const findBareSupers = _core.traverse.visitors.merge([{
  Super(path) {
    const {
      node,
      parentPath
    } = path;
    if (parentPath.isCallExpression({
      callee: node
    })) {
      this.push(parentPath);
    }
  }
}, _helperEnvironmentVisitor.default]);
const referenceVisitor = {
  "TSTypeAnnotation|TypeAnnotation"(path) {
    path.skip();
  },
  ReferencedIdentifier(path, {
    scope
  }) {
    if (scope.hasOwnBinding(path.node.name)) {
      scope.rename(path.node.name);
      path.skip();
    }
  }
};
function handleClassTDZ(path, state) {
  if (state.classBinding && state.classBinding === path.scope.getBinding(path.node.name)) {
    const classNameTDZError = state.file.addHelper("classNameTDZError");
    const throwNode = _core.types.callExpression(classNameTDZError, [_core.types.stringLiteral(path.node.name)]);
    path.replaceWith(_core.types.sequenceExpression([throwNode, path.node]));
    path.skip();
  }
}
const classFieldDefinitionEvaluationTDZVisitor = {
  ReferencedIdentifier: handleClassTDZ
};
function injectInitialization(path, constructor, nodes, renamer, lastReturnsThis) {
  if (!nodes.length) return;
  const isDerived = !!path.node.superClass;
  if (!constructor) {
    const newConstructor = _core.types.classMethod("constructor", _core.types.identifier("constructor"), [], _core.types.blockStatement([]));
    if (isDerived) {
      newConstructor.params = [_core.types.restElement(_core.types.identifier("args"))];
    }
    [constructor] = path.get("body").unshiftContainer("body", newConstructor);
  }
  if (renamer) {
    renamer(referenceVisitor, {
      scope: constructor.scope
    });
  }
  if (isDerived) {
    const bareSupers = [];
    constructor.traverse(findBareSupers, bareSupers);
    let isFirst = true;
    for (const bareSuper of bareSupers) {
      if (isFirst) {
        isFirst = false;
      } else {
        nodes = nodes.map(n => _core.types.cloneNode(n));
      }
      if (!bareSuper.parentPath.isExpressionStatement()) {
        const allNodes = [bareSuper.node, ...nodes.map(n => _core.types.toExpression(n))];
        if (!lastReturnsThis) allNodes.push(_core.types.thisExpression());
        bareSuper.replaceWith(_core.types.sequenceExpression(allNodes));
      } else {
        bareSuper.insertAfter(nodes);
      }
    }
  } else {
    constructor.get("body").unshiftContainer("body", nodes);
  }
}
function extractComputedKeys(path, computedPaths, file) {
  const declarations = [];
  const state = {
    classBinding: path.node.id && path.scope.getBinding(path.node.id.name),
    file
  };
  for (const computedPath of computedPaths) {
    const computedKey = computedPath.get("key");
    if (computedKey.isReferencedIdentifier()) {
      handleClassTDZ(computedKey, state);
    } else {
      computedKey.traverse(classFieldDefinitionEvaluationTDZVisitor, state);
    }
    const computedNode = computedPath.node;
    if (!computedKey.isConstantExpression()) {
      const scope = path.scope;
      const isUidReference = _core.types.isIdentifier(computedKey.node) && scope.hasUid(computedKey.node.name);
      const isMemoiseAssignment = computedKey.isAssignmentExpression({
        operator: "="
      }) && _core.types.isIdentifier(computedKey.node.left) && scope.hasUid(computedKey.node.left.name);
      if (isUidReference) {
        continue;
      } else if (isMemoiseAssignment) {
        declarations.push(_core.types.expressionStatement(_core.types.cloneNode(computedNode.key)));
        computedNode.key = _core.types.cloneNode(computedNode.key.left);
      } else {
        const ident = path.scope.generateUidIdentifierBasedOnNode(computedNode.key);
        scope.push({
          id: ident,
          kind: "let"
        });
        declarations.push(_core.types.expressionStatement(_core.types.assignmentExpression("=", _core.types.cloneNode(ident), computedNode.key)));
        computedNode.key = _core.types.cloneNode(ident);
      }
    }
  }
  return declarations;
}

//# sourceMappingURL=misc.js.map`;
    setText(
      code
        .replace(/\x28/g, " ( ")
        .replace(/\x29/g, " ) ")
        .replace(/{/g, " { ")
        .replace(/}/g, " } ")
        .replace(/\./g, " . ")
        .replace(/\[/g, " ] ")
        .replace(/\]/g, " [ ")
        .replace(/=/g, " = ")
        .replace(/\t|\r|\n/g, "\u00a0")
        .replace(/ +/g, "\u00a0")
        .split("\u00a0")
    );
  }, []);

  const whiteLimit = 230;
  const printCode = (code: string[], ctx: any) => {
    ctx.font = "16px Courier";
    ctx.fillStyle = "#000";
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

    //const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;

    // destination.style.background = rgba;
    // destination.textContent = rgba;

    // return rgba;

    /*ctx.font = "10px Consolas";
    var txt = "Hello World";
    let metrics = ctx.measureText(txt);
    let fontHeight =
      metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    let actualHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    ctx.fillStyle = "#000";
    ctx.fillText("fontHeight:" + fontHeight, 10, 50);
    ctx.fillText("actualHeight" + actualHeight, 30, 100);
    ctx.fillText("width" + metrics.width, 30, 150);
    ctx.fillText(txt, 10, 200);*/
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas != null) {
      const ctx = (canvas as any).getContext("2d", {
        willReadFrequently: true,
      });
      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, (canvas as any).width, (canvas as any).height);

      const img = new Image();
      img.crossOrigin = "anonymous";
      // img.src =
      //   "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png";
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
        <Box sx={{ my: 4 }}>
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
