
import "./index.css";
import Navbar from "./components/Navbar";
import SynthModule from "./components/synthmodule";


function App() {
 

    return (
        <>
            <div>
                < Navbar />
            </div>
            <div>
                < div className="min-h-[calc(100vh-4rem)] mt-16 w-screen bg-brandBlack outline outline-2 outline-white">
                    <div className="w-full">
                        < SynthModule />
                    </div>
                    <div className="grid-cols-1 bg-brandBlack outline outline-2 outline-white xl:grid-cols-2">
                    </div>
                </div>
            </div>
        </>
  )
}


export default App;

