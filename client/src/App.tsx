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
      const res = await fetch(`${BASIC_URL}/file/?page=${pag}`);
      if(!res.ok) {
        console.log('hubo un error');
        return;
      } 
      const response = await res.json();
      const bufferUrl: Links[] = response.body;
      const bod:Links[] = [];

      bufferUrl.map((item, i)=>{
        //if(item.url.split('2️⃣')[1] || item.url.split('3️⃣')[1] || item.url.split('🇺🇸')[1]) console.log(i)
        const basic = 'https://chat.whatsapp.com/';
        const key = item.url.split('https://chat.whatsapp.com/')[1];
        const sub = key.substring(0, 22);
        item.url = basic+sub;
        console.log(basic+sub)
        bod.push(item)
      });

      console.log('DNvzCFHs8NiILJfibacvjQ'.length);
      console.log('JWI0bRPuSzJ5WWESNOxNWu'.length)

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
                  <a href={item.url} target="LAN">
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
