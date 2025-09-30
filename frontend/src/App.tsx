import { useState } from 'react'
import "./index.css";
import Navbar from "./components/navbar";
import SynthModule from "./components/synthmodule";

function App() {
  const [count, setCount] = useState(0)

    return (
        <div>
            < Navbar />
            < div className="min-h-[calc(100vh-4rem)] mt-16 grid w-screen grid-cols-1 lg:grid-cols-2">
                <div className="bg-brandBlack outline outline-2 outline-white">
                    < SynthModule />
                </div>
                <div className="bg-brandBlack outline outline-2 outline-white">
                </div>
            </div>
        </div>
  )
}


export default App;

