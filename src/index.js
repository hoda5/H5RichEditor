import React from "react";
import ReactDOM from "react-dom";
import { H5RichEditor } from "./component/H5RichEditor";
import "./styles.css";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { html: "" }
  }
  
  render() {
    return (
      <div className="App">
        <div className="Editor">
          <H5RichEditor
            html={(this.state.html) || this.props.html}
            dados={dadosPaciente}
            corretor={false}
            onChange={({ html }) => {
              this.setState({ html });
            }}
          />
        </div>
        <pre>{this.state.html}</pre>
      </div>
    );
  }
}

const html = `
  <b>hoda5 </b><i>tecnologia </i><dinfield path="paciente.nome">Maria da Silva</dinfield>
`

const dadosPaciente = {
  paciente: {
    nome: "Maria da Silva",
    sexo: "Feminino",
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App html={html} />, rootElement);
