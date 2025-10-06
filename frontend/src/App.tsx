
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
                < div className="bg-brandBlack mt-16 min-h-[calc(100vh-4rem)] w-screen outline-2 outline-white">
                    <div className="w-full">
                        < SynthModule />
                    </div>
                    <div className="bg-brandBlack grid-cols-1 outline-2 outline-white xl:grid-cols-2">
                    </div>
                </div>
            </div>
        </>
  )
}


export default App;

