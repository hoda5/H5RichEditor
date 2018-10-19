import React from "react";
import ReactDOM from "react-dom";
import { H5RichEditor } from "./component/H5RichEditor";
import { htmlToPdfMake } from "./component/convert/htmlToPDF"

import "./styles.css";

const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
              valor_em_html = html;
              valor_em_pdfmake = htmlToPdfMake(valor_em_html, dadosPaciente)
              this.setState({});
            }}
          />
        </div>
        <div>{valor_em_html}</div>
        <button onClick={imprimirPDF}>PDFMake</button>
        <pre>{"var dd = " + JSON.stringify({
          content: valor_em_pdfmake
        }
          , null, 2)}</pre>
      </div>
    );
  }
}

let valor_em_html = `
  <b>hoda5 </b><i>tecnologia </i><dinfield path="paciente.nome">Maria da Silva</dinfield>
`

const dadosPaciente = {
  paciente: {
    nome: "Maria da Silva",
    sexo: "Feminino",
  }
}

let valor_em_pdfmake = htmlToPdfMake(valor_em_html, dadosPaciente)

function imprimirPDF() {
  const dd = {
    content: valor_em_pdfmake
  };
  pdfMake.createPdf(dd).download('Test.pdf');
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App html={valor_em_html} />, rootElement);
