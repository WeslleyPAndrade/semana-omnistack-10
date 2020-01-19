import React, { useState, useEffect } from 'react';// sempre importar o React para componentes
import api from './services/api';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

// Componente: - Bloco isolado de HTML, CSS e JS, o qual não interfere no restande da aplicação
//              usado quando um determinado bloco se repete varias vezes (Criar em novos arquivos)
// Propriedade: - (atributos HTML) Informações que um componente PAI (mais externo) passa para o componente FILHO
//                (mais interno)
// Estado: - Informação que o componente vai manipular - Informações mantidas pelo componente (Lembrar> imutabilidade)
//            import React, { useState } from 'react';

function App() {
  //###### Aula #########################
  // const [counter, setCounter] = useState(0);

  // function incrementCounter() {
  //   setCounter(counter + 1);
  // }

  // return (
  //   <>
  //     <h1>Contador: {counter}</h1>
  //     <button onClick={incrementCounter}>Incrementar</button>
  //   </>
  // );
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }

    loadDevs();
  }, []);

  async function handleAddDev(data) {

    const response = await api.post('/devs', data);

    //console.log(response.data);
    setDevs([...devs, response.data]);
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>

      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} />
          ))}
        </ul>
      </main>
    </div >
  );



}

export default App;
