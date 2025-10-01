import { useState } from 'react'
import "./index.css";
import Navbar from "./components/Navbar";
import SynthModule from "./components/synthmodule";


function App() {
  const [count, setCount] = useState(0)

    return (
        <div>
            < Navbar />
            < div className="min-h-[calc(100vh-4rem)] mt-16 grid w-screen grid-cols-1 bg-brandBlack outline outline-2 outline-white">
                <div className="m-2 w-10/12 align-middle outline outline-1 outline-amber-100">
                    < SynthModule />
                </div>
                
                <div className="grid-cols-1 bg-brandBlack outline outline-2 outline-white xl:grid-cols-2">
                </div>
            </div>
        </div>
  )
}


export default App;

