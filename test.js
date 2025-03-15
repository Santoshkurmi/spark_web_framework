import { Parser } from "htmlparser2";

const html = `
  <div id="container" class="main">
    <h1 styles={color:"red"}>Hello, World!</h1>
    <p onClick='{()=>console.log("Hello")}'>This is a paragraph.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </div>
`;

function convertToH(node) {
    if (!node) {
      return null;
    }
    if (node.type === "text") {
      return `hString("${node.data}")`;
    }
    if (node.type === "tag") {
      const children = node.children.map(convertToH).filter(child => child !== null).join(", ");
      return `h("${node.name}", ${JSON.stringify(node.props).replace(/"\s*({[^{}]*})\s*"/g, '$1').replace(/\\"/g, '"')}, [${children}])`;
    }
    return null;
  }

function parseHTML(html) {
  const root = { type: "root", children: [] };
  const stack = [root];

  const handler = {
    onopentag: (name, props) => {
      const element = {
        type: "tag",
        name,
        props,
        children: [],
      };
    //   console.log(typeof props.styles)
    if(typeof props.styles==="string"){
        console.log(props.styles)
        // props.styles = JSON.parse(props.styles)
    }
      stack[stack.length - 1].children.push(element);
      stack.push(element);
    },
    ontext: (text) => {
      const trimmedText = text.trim();
      if (trimmedText) {
        stack[stack.length - 1].children.push({
          type: "text",
          data: trimmedText,
        });
      }
    },
    onclosetag: (name) => {
      stack.pop();
    },
  };

  const parser = new Parser(handler, { decodeEntities: true, });
  parser.write(html);
  parser.end();

  return root.children[0];
}

const parsedHTML = parseHTML(html);
const parsedJson = JSON.stringify(parsedHTML, null, 2);

console.log(parsedJson);
const vDom = convertToH(parsedHTML);
console.log(vDom);
// for(let each in parsedJson){
//     console.log(each)
// }