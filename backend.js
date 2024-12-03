//#region Constants

const http = require('http');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const url = 'https://api.openai.com/v1/chat/completions';
const express = require('express');
const { send } = require('process');
const { time } = require('console');
const app = express();
let chat = [];
let stringForOutputChat = "";
app.use(express.urlencoded({ extended: true }));

let KEY = fs.readFileSync('key.txt', 'utf8');
console.log(KEY);

server2 = http.createServer(handleContactFormular);
server2.listen(63800);
console.log("Webserver running on http://127.0.0.1:63800")


http.createServer(async function ListenForAnswerRequest(req, res){
    const buffer = [];
    req.on('data', (chunk) => {
      buffer.push(chunk);
    });
    req.on('end',async () => {
      const text = Buffer.concat(buffer).toString();
      console.log(`Empfangener Text: ${text}`);
      // Hier kannst du den Text verarbeiten und filtern
      const filteredText = text.replace(/[^a-zA-Z0-9 ]/g, '');
      console.log(`Gefilterter Text: ${filteredText}`);

      let InputForChatGPT = "";        
        
      let topic = text.split("123Trenner321")[1] + "";
      console.log(topic)

      let question = text.split("123Trenner321")[0] + "";
      console.log(question)

      InputForChatGPT += "Es geht um das Thema "+topic+" und die Frage ist: "+question+"?";        
      console.log(InputForChatGPT)

      
      
      let response = await sendPrompt(InputForChatGPT);
      console.log(response);
      let output = response.choices[0].message.content;
      console.log(output);
      

      chat.push(InputForChatGPT);
      chat.push(output);

      let stringForOutputChatBefore = "" + stringForOutputChat;

      stringForOutputChat = '<div class="question">' + InputForChatGPT + '</div>';
      stringForOutputChat += '<div class="answer">' + output+ '</div>';

      fs.writeFileSync('chatHistory.txt',stringForOutputChat);

      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      
      
      res.write(stringForOutputChat);
      res.end();

    });
  }).listen(8080, () => {
    console.log('Webserver running on http://127.0.0.1:8080');
  });

async function sendPrompt(prompt) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer `+KEY, // Hier OPENAPIKEY verwenden
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-4o", //-4o
            messages: [{ role: "user", content: prompt }],
        }),
    })
    .then(handleResponse)
    .catch(handleError);
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }
    return response.json(); // JSON-Daten zurückgeben
}


function handleError(error) {
    console.error(error);
}
//#endregion

let errorHelper = 1;
function handleContactFormular(req,res){

  let input = req.url + "";
  
    if((errorHelper%7 == 0 || errorHelper == 1)&& input != "/KontaktSeite.css" && input != "/favicon.ico"){
      
      input = decode(input);
      let now = new Date();
      
      let Name = input.split("name=")[1].split("&")[0];
      let Email = input.split("email=")[1].split("&")[0];
      let Betreff = input.split("betreff=")[1].split("&")[0];
      let Message = input.split("message=")[1].split("&")[0];
      let text=fs.readFileSync('ContactFormular.txt','utf8');
      fs.writeFileSync('ContactFormular.txt', text +'\nValue/ID: '+now.getHours()+":"+now.getMinutes()+" | "+now.getDate()+"/"+now.getMonth()+"/"+now.getFullYear() + '\nBetreff: ' + Betreff +  '\nName: ' + Name + '\nEmail: ' + Email + '\nMessage: ' + Message + '\n'+'\n\n');
      errorHelper = errorHelper+1;
      res.write(fs.readFileSync('KontaktSeite.html','utf8'));
      res.write('<style>'+fs.readFileSync('KontaktSeite.css','utf8')+'</style>');
      res.write('<style>'+fs.readFileSync('HeaderFooter.css','utf8')+'</style>');
      res.end()
      
    }
    else{
      
      errorHelper = errorHelper+1;
      res.write(fs.readFileSync('KontaktSeite.html','utf8'));
      res.write('<style>'+fs.readFileSync('KontaktSeite.css','utf8')+'</style>');
      res.write('<style>'+fs.readFileSync('HeaderFooter.css','utf8')+'</style>');
      res.end();
  }
}
function decode(inputQuery){

   for(let i = 0; i < inputQuery.length; i++) {
    inputQuery = inputQuery.replace("%0D%0A", "\n");
    inputQuery = inputQuery.replace("+", " ");
    inputQuery = inputQuery.replace("%3B", ";");
    inputQuery = inputQuery.replace("%C3%9C", "Ü");
    inputQuery = inputQuery.replace("%C3%84", "Ä");
    inputQuery = inputQuery.replace("%C3%96", "Ö");
    inputQuery = inputQuery.replace("%C3%BC", "ü");
    inputQuery = inputQuery.replace("%C3%A4", "ä");
    inputQuery = inputQuery.replace("%C3%B6", "ö");
    inputQuery = inputQuery.replace("%C3%9F", "ß");
    inputQuery = inputQuery.replace("%E1%BA%9E", "ẞ");
    inputQuery = inputQuery.replace("%3A", ":");
    inputQuery = inputQuery.replace("%2C", ",");
    inputQuery = inputQuery.replace("%23", "#");
    inputQuery = inputQuery.replace("%27", "'");
    inputQuery = inputQuery.replace("%7E", "~");
    inputQuery = inputQuery.replace("%28", "(");
    inputQuery = inputQuery.replace("%29", ")");
    inputQuery = inputQuery.replace("%5B", "[");
    inputQuery = inputQuery.replace("%5D", "]");
    inputQuery = inputQuery.replace("%7B", "{");
    inputQuery = inputQuery.replace("%7D", "}");
    inputQuery = inputQuery.replace("%3E", ">");
    inputQuery = inputQuery.replace("%3C", "<");
    inputQuery = inputQuery.replace("%2F", "/");
    inputQuery = inputQuery.replace("%3F", "?");
    inputQuery = inputQuery.replace("%21", "!");
    inputQuery = inputQuery.replace("%2D", "-");
    inputQuery = inputQuery.replace("%5E", "^");
    inputQuery = inputQuery.replace("%7C", "|");
    inputQuery = inputQuery.replace("%5C", "\\");
    inputQuery = inputQuery.replace("%40", "@");
   }
    return inputQuery
}