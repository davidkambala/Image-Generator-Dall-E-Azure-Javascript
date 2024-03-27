import express from "express";
import bodyParser from "body-parser";
import axios from 'axios';
import env from "dotenv";
import "dotenv/config";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url)); 
// Import necessary classes from the @azure/openai package
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

//environment variables
const endpoint = process.env.ENDPOINT || "<endpoint>";
const azureApiKey = process.env.AZURE_API_KEY || "<api key>";

//image size and number of images
const size = "1024x1024";
const n = 1;

var prompt;
var imageURL;

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//Generate Image
async function main() {
    console.log("== Batch Image Generation ==");
  
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const deploymentName = "Dalle3";
    const results = await client.getImages(deploymentName, prompt, { n, size });
    console.log(results);
    for (const image of results.data) {
      console.log(`Image generation result URL: ${image.url}`);
      imageURL = image.url;
    }
  }
//main function



app.get("/", (req, res) => {
    //console.log("endpoint: ",endpoint);
    //console.log("apiKey: ", azureApiKey);
    res.render("index.ejs");
})
app.post("/generate", async (req, res) => {
    prompt = req.body["textPrompt"];
    console.log(prompt);
    //res.render("index.ejs");
    await main().catch((err) => {
        console.error("The sample encountered an error:", err);
      });
    res.render("generated.ejs", {
        imgSource: imageURL
    });
})


app.listen(port, ()=> {
    console.log(`Server running on http://localhost:${port}`);
})