require('dotenv').config();

const express = require('express');

const cors = require('cors');

// Set your OpenAI API key
const apiKey = process.env.OPEN_AI_API_KEY;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Welcome To Open AI');
})

async function getResponse(prompt) {
    
    try {

        const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                prompt,
                max_tokens: 150,  // Adjust as needed
            }),
        });

        const responseData = await response.json();
        const generatedCode = responseData.choices[0].text.trim();

        console.log(`generatedCode `, generatedCode);

        return generatedCode;


    } 
    catch (error) {

        console.error('Error converting code:', error);
        return error;
    }
}

app.post('/converter', async (req, res) => {

    const { inputCode, sourceLanguage, targetLanguage } = req.body;

    let prompt;
    if (sourceLanguage) {
        prompt = `Convert the following ${sourceLanguage} code to ${targetLanguage}:\n${inputCode}`;
    } else {
        prompt = `Convert the following code into ${targetLanguage}:\n${inputCode}`;
    }
    
    return res.status(400).send({
        data: await getResponse(prompt)
    })
})


app.post('/debug', async (req, res) => {

    const { inputCode, sourceLanguage, targetLanguage } = req.body;

    const prompt = `debug the following code (which could include identification of errors, suggestions for fixes, etc.) : \n${inputCode}`;

    return res.status(400).send({
        data: await getResponse(prompt)
    })

})


app.post('/performance', async (req, res) => {

    const { inputCode, sourceLanguage, targetLanguage } = req.body;

    const prompt = `check performance of the following code and assessment of the code's quality (such as commentary on style, organization, potential improvements, etc.) : \n${inputCode}`;

    return res.status(400).send({
        data: await getResponse(prompt)
    })
})

app.listen(3000, () => {
    console.log('server is running');
})


