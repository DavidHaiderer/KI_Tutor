//#region Constants

const http = require('http');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
require('dotenv').config();
const url = 'https://api.openai.com/v1/chat/completions';
const express = require('express');
const { send } = require('process');
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

      for(let i = 0; i<chat.length;i++){
          if(i%2 != 0){
              stringForOutputChat += '<div class="answer">' + chat[i] + '</div>';
          }
          else{
              stringForOutputChat += '<div class="question">' + chat[i] + '</div>';
          }
      }
      
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

function handleContactFormular(req,res){
    let input = req.url + "";

    let Name = input.split("name=")[1].split("&")[0];
    let Email = input.split("email=")[1].split("&")[0];
    let Betreff = input.split("betreff=")[1].split("&")[0];
    let Message = input.split("message=")[1].split("&")[0];

    fs.writeFileSync('ContactFormular.txt','Betreff: ' + Betreff +  '\nName: ' + Name + '\nEmail: ' + Email + '\nMessage: ' + Message + '\n'+'\n\n');

}