import { useState } from "react";
import { BASIC_URL } from "../constants";

export const ModalForm = ({cb}:{cb: ()=>void}) => {
    const [file, setFile] = useState<File | null>();
    const [nameGroup, setNameGroup] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const saveFile = async () => {
          if(!file) return;
    
          const formData = new FormData();
          formData.append('file', file);
          formData.append('group', nameGroup);

          const res = await fetch(`${BASIC_URL}/file`, {
            "method":"POST",
            "body":formData
          });
          const response = await res.json();
          console.log(response);
        }
        saveFile();
    }

    return (
        <div className='absolute w-screen min-h-screen bg-black bg-opacity-40 flex justify-center items-center'>
            <button
                onClick={()=>{cb()}}  
                className='w-20 h-20 bg-black text-white text-xl flex justify-center items-center absolute top-5 left-5 rounded-full'  
            >
                X
            </button>
            <section className='bg-white p-8 rounded-md'>
            <h2 className='font-bold text-center text-xl text-gray-600'>Carga un Archivo</h2>
            <form onSubmit={handleSubmit} className='grid gap-y-4'>
                <label>Nombre del grupo</label>
                <input onChange={(event)=>{setNameGroup(event.target.value)}} type='text' placeholder="nombre del grupo" className='p-3 rounded-md border focus:outline-none bg-white text-black' />
                <input onChange={(event)=>{
                if(event.target.files && event.target.files.length > 0) setFile(event.target.files[0]);

                }} type='file' className='px-10 py-2 bg-gray-200 fnot-bold' />
                <input type='submit' value='cargar' className='py-3 bg-green-500 hover:bg-green-600 rounded-md font-bold' />
            </form>
            </section>
        </div>
    )
}