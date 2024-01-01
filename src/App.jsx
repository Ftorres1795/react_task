import Navbar from "./Navbar";
import Tasks from "./Tasks";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <div className='container'>
        <Tasks />
      </div>
    </>
  );
}

export default App;
