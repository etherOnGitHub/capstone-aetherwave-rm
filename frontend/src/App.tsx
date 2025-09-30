import { useState } from 'react'
import "./index.css";
import Navbar from "./components/navbar";

function App() {
  const [count, setCount] = useState(0)

    return (
        <div>
            < Navbar />
            <div className="min-h-[calc(100vh-4rem)] mt-16 grid w-screen grid-cols-1 lg:grid-cols-2">
                <div className="bg-blue-200">1</div>
                <div className="bg-red-200">2</div>
            </div>
        </div>
  )
}


export default App;

