import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';
import axios from 'axios';

class App extends React.Component {
  state = {
    innercomp: <textarea rows="4" cols="50" id="textinput" />,
    mode: "text",
    sentimentOutput: [],
    sentiment: true
  }

  renderTextArea = () => {
    document.getElementById("textinput").value = "";
    if (this.state.mode === "url") {
      this.setState({
        innercomp: <textarea rows="4" cols="50" id="textinput" />,
        mode: "text",
        sentimentOutput: [],
        sentiment: true
      })
    }
  }

  renderTextBox = () => {
    let textBoxStyle = {
      "max-height": "100px",
      "min-height": "40px",
      "overflow-y": "auto"
    }
    document.getElementById("textinput").value = "";
    if (this.state.mode === "text") {
      this.setState({
        innercomp: <textarea rows="1" cols="50" id="textinput" style={textBoxStyle} />,
        mode: "url",
        sentimentOutput: [],
        sentiment: true
      })
    }
  }

  sendForSentimentAnalysis = () => {
    this.setState({ sentiment: true });
    let ret = "";

    //used for final build
    // let url = ".";

    //used for testing in development
    let url = "http://localhost:8080";

    if (this.state.mode === "url") {
      url = url + "/url/sentiment?url=" + document.getElementById("textinput").value;
    } else {
      url = url + "/text/sentiment?text=" + document.getElementById("textinput").value;
    }
    ret = axios.get(url);

    //Defines CSS style for the sentiment output
    let outputStyle = {
      color: "",
      fontSize: "20px",
      "background-color": "lightgrey"
    };

    ret.then((response) => {
      //console.log(response);
      //----------Include code here to check the sentiment and format the data accordingly----------

      //Extracts label property from JSON result
      let sentiment = response.data.document.label;
      if (sentiment === "positive") {
        outputStyle.color = "green";
      } else if (sentiment === "negative") {
        outputStyle.color = "red";
      } else {
        outputStyle.color = "yellow";
      }

      //Creates div with corresponding sentiment and updates state
      let output = <div style={outputStyle}>{sentiment}</div>
      this.setState({ sentimentOutput: output });
    })

      //Formats and shows error if query was unsuccessful
      .catch(err => {
        outputStyle.color = "black";
        let output = <div style={outputStyle}>{`Error: Request could not be processed\n${err}`}</div>
        this.setState({ sentimentOutput: output });
      });
  }

  sendForEmotionAnalysis = () => {
    this.setState({ sentiment: false });
    let ret = "";
    //used for final build
    // let url = ".";

    //used for testing in development
    let url = "http://localhost:8080";

    if (this.state.mode === "url") {
      url = url + "/url/emotion?url=" + document.getElementById("textinput").value;
    } else {
      url = url + "/text/emotion/?text=" + document.getElementById("textinput").value;
    }
    ret = axios.get(url);

    ret.then((response) => {

      //Updates state with the component returned by emotionTable. emotion JSOn object is passed as props
      this.setState({ sentimentOutput: <EmotionTable emotions={response.data.document.emotion} /> });
    })
      .catch(err => {
        let outputStyle = {
          color: "",
          fontSize: "20px",
          "background-color": "lightgrey"
        };
        outputStyle.color = "black";
        let output = <div style={outputStyle}>{`Error: Request could not be processed\n${err}`}</div>
        this.setState({ sentimentOutput: output });
      });
  }


  render() {
    return (
      <div className="App">
        <button className="btn btn-info" onClick={this.renderTextArea}>Text</button>
        <button className="btn btn-dark" onClick={this.renderTextBox}>URL</button>
        <br /><br />
        {this.state.innercomp}
        <br />
        <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
        <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
        <br />
        {this.state.sentimentOutput}
      </div>
    );
  }
}

export default App;
