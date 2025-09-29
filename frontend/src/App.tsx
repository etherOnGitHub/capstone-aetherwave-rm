import { useState } from 'react'
import "./index.css";
import Navbar from "./components/navbar";

function RtnMsg() {
    return <h1 className="text-3xl font-bold text-blue-500">Tailwind Works!</h1>
}

function App() {
  const [count, setCount] = useState(0)

    return (
        < Navbar />
  )
}

export default App;

