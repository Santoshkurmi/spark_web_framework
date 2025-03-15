const html = `
  <div id="container" styles={color:"red"} onClick={()=>console.log("Hello World")} class="main">
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
    let tagProps = "";
    let isPropStarted = false;
    for(let i=0;i<html.length;i++){
        let char = html[i];
        if(char ==" " && !isTagStarted){
            continue;
        }
        if(char=='<'){
            isTagStarted = true;
            continue;
        }
        if(!isPropStarted && isAlphabet(char)){
            tagName+=char;
            continue;
        }
        if(char==" "){
            isPropStarted = true;
            continue;
        }
        if(isPropStarted){
            break
            tagProps+= char;
        }


    }//loop

    return tagName
}

  
//   const html = `<div class="container"><h1>Hello</h1><p>World</p></div>`;
  console.log(parseHtml(html));
  
  