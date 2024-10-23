//#region Constants

const http = require('http');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const url = 'https://api.openai.com/v1/chat/completions';
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

async function handleRequest(req,res){
    try{
        let InputForChatGPT = "";
        
    
        let inputQuery = req.url;

        for(let i = 0; i<inputQuery.length;i++){
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
        }
        
        let topic = req.body.topic;
        let question = req.body.question;

        InputForChatGPT += "Es geht um das Thema "+topic+" und die ist Frage: "+question+"?";        
        console.log(InputForChatGPT)
        
        let response = await sendPrompt(InputForChatGPT);
        let output = response.choices[0].message.content;

        let html = fs.readFileSync('frontend_MakrosGen.html', 'utf8');
        let htmlResponse = html.replace('<textarea class="output" id="copyFunctionForText"></textarea>', '<textarea class="output" id="copyFunctionForText">'+output+'</textarea>');

        let css = fs.readFileSync('Style.css');

        // Antwort von der API zurücksenden
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(htmlResponse + `<style>${css}</style>`)
        
        res.end();
        
    } catch (error) {
        console.error('Fehler:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Fehler bei der Anfrage an die ChatGPT API.');
    }
}

async function sendPrompt(prompt) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Hier OPENAPIKEY verwenden
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


server = http.createServer(handleRequest);
server.listen(9000);
console.log("Webserver running on http://127.0.0.1:9000")
server2 = http.createServer(handleContactFormular);
server2.listen(63800);
console.log("Webserver running on http://127.0.0.1:63800")


function handleContactFormular(req,res){
    let Name = req.body.name;
    let Email = req.body.email;
    let Betreff = req.body.betreff;
    let Message = req.body.message;

    fs.writeFileSync('C:\\ContactFormular.txt','Betreff: ' + Betreff +  '\nName: ' + Name + '\nEmail: ' + Email + '\nMessage: ' + Message + '\n');

}