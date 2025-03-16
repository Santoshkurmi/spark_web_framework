const html = `
  <div tiger="cat" man={()=>{return "Hello world"}} onclick={()=>{return "Hello world"}} id="container" styles={color:"red"}  class="main">
    <h1 styles={color:"red"}>Hello, World!</h1>
    <p onClick='{()=>console.log("Hello")}'>This is a paragraph.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </div>
`;


function isAlphabet(char) {
  const unicodeValue = char.charCodeAt(0);
  // Check if the character is between 'A' and 'Z' (65 to 90) or between 'a' and 'z' (97 to 122)
  return (unicodeValue >= 65 && unicodeValue <= 90) || (unicodeValue >= 97 && unicodeValue <= 122);
}

function parseHtml(html) {

  let isTagStarted = false;
  let tagName = "";
  let tagProps = {};
  let isPropStarted = false;
  let curlyBracketsCount = 0;
  let squareBracketsCount = 0;
  let doubleQuotesCount = 0;
  let parenthesesCount = 0;
  let root = { type: "root", children: [] };
  let stack = [root];
  let propKey = "";
  let propValue = '';
  for (let i = 0; i < html.length; i++) {
    let char = html[i];

    while (char == " " || char == "\n") {
      i++;
      char = html[i];
    }//skip spaces

    if (char == '<') {
      // <div   aa
      i++;
      char = html[i];
      tagName = "";
      while (char != " " && char != "\n") { //need to handle for closing tag here
        // char = html[i];
        // console.log(html[i+3]);
        // break
        tagName += char;
        i++;
        char = html[i];
        // if(char==" ") console.log(char,"yes");
      }
      // continue;
    }//tag start found
    // console.log(char);

    while (char == " " || char == "\n") {
      i++;
      char = html[i];
    }//skip spaces for props

    while (char != ">") {
      propKey = char;
      i++;
      char = html[i];
      while (isAlphabet(char)) {
        propKey += char;
        i++;
        char = html[i];
      }//found prop
      while (char == " " || char == "\n") {
        i++;
        char = html[i];
      }//skip spaces for props
      if (char == "=") {
        i++
        char = html[i];
        while (char == " " || char == "\n") {
          i++;
          char = html[i];
        }
        //now time for value

        if (char == '{') {
          propValue += '{';
          curlyBracketsCount++;
          while (curlyBracketsCount > 0 || squareBracketsCount > 0 || doubleQuotesCount > 0 || parenthesesCount > 0) {
            i++;
            char = html[i];
            propValue += char;
            if (char == '{') {
              curlyBracketsCount++;
            }
            else if (char == '}') {
              curlyBracketsCount--;
            }
            else if (char == '[') {
              squareBracketsCount++;
            }
            else if (char == ']') {
              squareBracketsCount--;
            }
            else if (char == '"') {
              if (doubleQuotesCount == 0) {
                doubleQuotesCount = 1
              } else {
                doubleQuotesCount = 0;
              }
            }
            else if (char == '(') {
              parenthesesCount++;
            }
            else if (char == ')') {
              parenthesesCount--;
            }
          }//while bracket
        }//if curly means js code
        else if (char == '"') {
          i++;
          char = html[i];
          propValue += '"' + char;
          while (char != '"') {
            i++;
            char = html[i];
            propValue += char;
          }

        }//for doubel quotes
        tagProps[propKey] = propValue;
        //found Here propKey with Value
        // console.log(tagName, propKey, propValue);
        propValue = ""
        while (char == " " || char == "\n") {
          i++;
          char = html[i];
        }//skip spaces for props

      }//handle error for not equal


    }//while not >
    if(char==">"){
      let tagNode = {tag: tagName, props: tagProps, children: []};
      stack[stack.length - 1].children.push(tagNode);
      stack.push(tagNode);
      tagName = "";
      tagProps = {};
    }
    // console.log(tagProps)
    //found > so got tag with props
    if(char = "<"){
      i++;
      char = html[i];
      if(char == "/"){
        i++;
        char = html[i];
        while(isAlphabet(char)){
          tagName += char;
          i++;
          char = html[i];
        }
        if(char == ">"){
          // let tagNode = {tag: tagName, props: tagProps, children: []};
          // stack[stack.length - 1].children.push(tagNode);
          stack.pop();
          // tagName = "";
          tagName = "";
        }
        //found closing tag
        // let tagNode = {tag: tagName, props: tagProps, children: []};
        // stack[stack.length - 1].children.push(tagNode);
      }
    }

  }//loop

  return stack[0].children;
}


//   const html = `<div class="container"><h1>Hello</h1><p>World</p></div>`;
console.log(JSON.stringify(parseHtml(html), null, 2));

