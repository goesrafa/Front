import {useEffect, useState, useRef, FormEvent} from 'react'
import {FiTrash} from 'react-icons/fi'
import { api } from './services/api'

interface CustomerProps{
  id: string;
  name: string;
  email: string;
  status: boolean;
  created_at: string
}

export default function App(){

  const [customers, setCustomer] = useState<CustomerProps[]>([])
  const nameRaf = useRef<HTMLInputElement | null >(null)
  const emailRaf = useRef<HTMLInputElement | null >(null)


useEffect(() =>{
  loadCustomers()
}, [])

async function loadCustomers() {
    const response = await api.get('/customers')
    setCustomer(response.data)
}

  async function handleSubmit(event: FormEvent){
  event.preventDefault();
  
  if(!nameRaf.current?.value || !emailRaf.current?.value) return;

  const response = await api.post('/customer' ,{
    name: nameRaf.current?.value,
    email:emailRaf.current?.value
  })

  setCustomer(allCustomers =>[...allCustomers, response.data])

  nameRaf.current.value = "",
  emailRaf.current.value=""
}

async function handleDelete(id: string) {
  try{  
    await api.delete('/customer', {
      params:{
        id: id
      }
    })


    const allCustomers = customers.filter((customer) => customer.id !== id)
    setCustomer(allCustomers);

   

  }catch(err){
  console.log(err)
  }
}

  return(
    <div className="w-full min-h-screen bg-gray-800 flex justify-center px-4">
        <main className="my-7 w-full md:max-w-2xl">
            <h1 className="text-4xl font-medium text-white"> Clientes </h1>

            <form className="flex flex-col my-6" onSubmit={handleSubmit}>
              <label 
              className="font-bold text-white">Nome: </label>

              <input 
              type="text" 
              placeholder="Digite o nome" 
              className="w-full mb-6 p-2 rounded"
              ref={nameRaf}
              />

              <label className="font-bold text-white">Email: </label>
              <input 
              type="text" 
              placeholder="Digite o email" 
              className="w-full mb-6 p-2 rounded"
              ref={emailRaf}
              
              />

              <input 
              type="submit" 
              value="Cadastrar" 
              className="cursor-pointer w-full p-2 bg-teal-500 font-medium rounded" />
            </form>

            <section className="flex flex-col gap-5">
              {customers.map((customer) => (
                <article
                key={customer.id}
                className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200"
              >
                <p><span className="font-medium">Nome:</span> {customer.name}</p>
                <p><span className="font-medium">Email:</span> {customer.email}</p>
                <p><span className="font-medium">Status:</span> {customer.status ? 'Ativo': 'Inativo'}</p>

                <button 
                className='bg-red-800 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2'
                onClick={() => handleDelete(customer.id)}
                >
                    <FiTrash size={18} color="#FFF"/>
                </button>
              </article>
              ))}
            </section>
        </main>
    </div>
  )
}