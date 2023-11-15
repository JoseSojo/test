import { useEffect, useState } from "react";
import { BASIC_URL } from "./constants";
import { ModalForm } from "./component/ModalForm";

interface Links {
  _id: string,
  url: string,
  status: number
}
function App() {
  const [url, setUrl] = useState<Links[] | null>(null);
  const [pag, setPag] = useState(0);
  const [modal, setModal] = useState(false);
  const [load] = useState(false);

  const After = () => {
    setModal(false);
  }

  useEffect(()=> {
    const LoadLinks = async () => {
      const res = await fetch(`${BASIC_URL}/file/?page=${pag}`);
      if(!res.ok) {
        console.log('hubo un error');
        return;
      } 
      const response = await res.json();
      const bufferUrl: Links[] = response.body;
      const bod:Links[] = [];

      bufferUrl.map((item)=>{

        bod.push(item)
      });

      setUrl(bod);
    }
    LoadLinks();
  }, [pag,load])

  /*const handleClick = (id:string) => {
    const bloqued = async () => {
      const requestOptions = {
        method: 'PUT',
        header: {
          "Content-Type":"application/json"
        }
      }
      const res = await fetch(`${BASIC_URL}/bloqued/{id}`, requestOptions);
      const response = await res.json();

      setLoad(!load);
    }
  }*/

  return (
    <>
      { modal && <ModalForm cb={After} /> }

      <main className='bg-gray-100 w-full min-h-screen grid'>
        <button 
          onClick={()=>{setModal(true)}}
          className='py-3 px-5 bg-green-500 hover:bg-green-600 rounded-md mx-auto h-16 font-bold mt-5'
        >
          Cargar Archivo
        </button>
        {
          url === null
          ? <>CARGANDO...</>
          : <ul className='w-[80vw] grid place-items-center gap-y-3 mx-auto'>
            {
              url.map(item => (
                <li className='w-full py-3 text-center visited:text-white visited:bg.blue-100 text-black bg-blue-400 rounded-md' key={item._id}>
                  <a href={`https://chat.whatsapp.com/${item.url}`} target="LAN">
                    {item.url}
                  </a>
                </li>
              ))
            }
          </ul>
        }
      </main>
      <footer className='flex justify-between'>
        {
          pag === 0
          ? <span></span>
          : <button onClick={()=>setPag(pag-1)} className='py-3 px-10 font bold bg-blue-500 hover:bg-blue-600'>Anterior</button>
        }
        <button onClick={()=>setPag(pag+1)} className='py-3 px-10 font bold bg-blue-500 hover:bg-blue-600'>Seguiente</button>
        
      </footer>
    </>
  )
}

export default App
