const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

//Uses dotenv to get API keys and returns an instance of NLU 
function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,

        }),
        serviceUrl: api_url
    });
    return naturalLanguageUnderstanding;
}

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/url/emotion", (req, res) => {

    //Gets an instance of NLU and constructs the parameters needed for analysis
    const nlu = getNLUInstance();
    const analyzeParams = {
        url: req.query.url,
        features: {
            emotion: {}
        }
    };

    //Queries the NLU API and processes the response when it arrives
    nlu.analyze(analyzeParams)
        .then(results => {
            // console.log(JSON.stringify(results,null,2));

            //Sends emotion JSON object to client
            return res.send(results.result.emotion);
        })
        //Captures error and sends it to client
        .catch(err => {
            console.log(err)
            return res.send(err)
        })
});

app.get("/url/sentiment", (req, res) => {
    const nlu = getNLUInstance();
    const analyzeParams = {
        url: req.query.url,
        features: {
            sentiment: {}
        }
    };

    nlu.analyze(analyzeParams)
        .then(results => {
            // console.log(JSON.stringify(results,null,2));

            return res.send(results.result.sentiment);
        })
        .catch(err => {
            console.log(err)
            return res.send(err)
        })
});

app.get("/text/emotion", (req, res) => {
    const nlu = getNLUInstance();
    const analyzeParams = {
        text: req.query.text,
        features: {
            emotion: {}
        }
    };

    nlu.analyze(analyzeParams)
        .then(results => {
            return res.send(results.result.emotion);
        })
        .catch(err => {
            console.log(err)
            return res.send(err)
        })
});

app.get("/text/sentiment", (req, res) => {
    const nlu = getNLUInstance();
    const analyzeParams = {
        text: req.query.text,
        features: {
            sentiment: {}
        }
    };

    nlu.analyze(analyzeParams)
        .then(results => {
            return res.send(results.result.sentiment);
        })
        .catch(err => {
            console.log(err)
            return res.send(err)
        })
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})
