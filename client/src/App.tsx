import React, { useEffect, useState } from "react";
import { BASIC_URL } from "./constants";

interface Links {
  _id: string,
  url: string,
  status: number
}
function App() {
  const [file, setFile] = useState<File | null>();
  const [url, setUrl] = useState<Links[] | null>(null);
  const [pag, setPag] = useState(0);

  useEffect(()=> {
    const LoadLinks = async () => {
      console.log(`${BASIC_URL}/file/?page=${pag}`)
      const res = await fetch(`${BASIC_URL}/file/?page=${pag}`);
      console.log(res);
      if(!res.ok) {
        console.log('hubo un error');
        return;
      } 
      const response = await res.json();
      console.log(response);
      const bufferUrl: Links[] = response.body;
      const bod:Links[] = [];

      bufferUrl.map((item)=>{
        console.log(item.url.split('11/'));
        if(item.url.split('10/')[1]) {
          item.url = item.url.split('10/')[0];
          bod.push(item);
          return;
        } else if(item.url.split('11/')[1])  {
          item.url = item.url.split('11/')[0];
          bod.push(item);
          return;
        } else if(item.url.split('Se')[1])  {
          item.url = item.url.split('Se')[0];
          bod.push(item);
          return;
        } else {
          bod.push(item);
          return;
        }
      });

      setUrl(bod);
    }
    LoadLinks();
  }, [pag])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const saveFile = async () => {
      if(!file) return;

      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${BASIC_URL}/file`, {
        "method":"POST",
        "body":formData
      });
      const response = await res.json();
      if(response.response == 'SUCCESS') setPag(0);
    }
    saveFile();
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input onChange={(event)=>{
          if(event.target.files && event.target.files.length > 0) setFile(event.target.files[0]);

        }} type='file' className='px-10 py-2 bg-gray-200 fnot-bold' />
        <input type='submit' value='cargar' />
      </form>
      <main className='bg-gray-400 w-full min-h-screen'>
        <button onClick={()=>{
          setUrl(null);
          console.log('paguina:', pag);
          setPag(pag+1);
        }}>pagina {pag}</button>
        {
          url === null
          ? <>CARGANDO...</>
          : <ul className='w-[80vw] grid place-items-center gap-y-3 mx-auto'>
            {
              url.map(item => (
                <li className='w-full py-3 text-center bg-gray-100 rounded-md' key={item._id}>
                  <a href={item.url}>
                    {item.url.split('10/')[0]}
                  </a>
                </li>
              ))
            }
          </ul>
        }
      </main>
    </>
  )
}

export default App
