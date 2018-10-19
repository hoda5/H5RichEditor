Exemplo de uso

```jsx
<H5RichEditor
   html={valor_em_html}
   dados={dadosPaciente}
   corretor={false}
   onChange={({ html }) => {
     valor_em_html = html
     this.setState({ });
   }}
/>
  
let valor_em_html = `
  <b>hoda5 </b><i>tecnologia </i><dinfield path="paciente.nome">Maria da Silva</dinfield>
`;

const dadosPaciente = {
  paciente: {
    nome: "Maria da Silva",
    sexo: "Feminino",
  }
}  
```       
          
