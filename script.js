//setting up the editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python");

var compileBtn = document.getElementById("btn-compile");
var editorContent = document.querySelector("#editor .ace_content");
var wrapper = document.querySelector(".wrapper")
var language = document.getElementById("language");
var consoleText = document.querySelector(".console-wrapper p");

var modes = { "0": "python", "4": "javascript", "7": "c_cpp", "77":"c_cpp", "8": "java"};
const url = "https://codequotient.com/api/";


language.addEventListener("change", () => {
    let val = language.value;
    editor.session.setMode("ace/mode/" + modes[val]);
    enableButton();
    consoleText.innerText = "OUTPUT:";
});

compileBtn.addEventListener("click", () => {
    disableButton();
    consoleText.innerText = "";
    setTimeout(enableButton, 10000);

    code = editorContent.innerText;
    let langId = language.value;
    data = { code: code, langId: langId};
    sendRequest(JSON.stringify(data));
});

function sendRequest(data){
    let request = new XMLHttpRequest();
    request.open("POST", url+"executeCode", true);    // run asynchronously
    request.setRequestHeader("Content-type", "application/json");

    // console.log(data);
    request.send(data);
    request.addEventListener('load', (res) => {
        // console.log(res);
        let codeId = (JSON.parse(res.target.responseText)).codeId;
        // console.log(codeId);

        setTimeout(()=>{
            let getReq = new XMLHttpRequest();
            getReq.open("GET", url + "codeResult/" + codeId, true);
            getReq.send();
            getReq.addEventListener('load', (res) => {
                // console.log(res);
                let output = JSON.parse(res.target.responseText);
                output = JSON.parse(output.data);
                // console.log(output);
                consoleText.innerHTML = output.output + output.errors;
                enableButton();
            });
        }, 2000);
    });
}

function enableButton(){
    compileBtn.classList.remove("disable");
    // compileBtn.setAttribute("disabled", false);
}

function disableButton(){
    compileBtn.classList.add("disable");
    // compileBtn.setAttribute("disabled", true);
}

/*
    request.open("post", url, true);    // run asynchronously
    // request.setRequestHeader('Content-type', 'application/json');
    // request.setRequestHeader('Access-Control-Allow-Origin','https://codequotient.com');
    // request.setRequestHeader('Access-Control-Allow-Methods','GET, POST');
    // request.setRequestHeader('Access-Control-Allow-Headers','Content-type');

}*/