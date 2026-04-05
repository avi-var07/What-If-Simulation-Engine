import { useState } from "react";
import axios from "axios";

function App(){
  const [conversion, setConversion]=useState(0);
  const [dealSize, setDealSize] = useState(0);
  const [data, setData] = useState(null);

  const runSimulation = async() =>{
    const res = await axios.get("http://localhost:5000/simulation", {
      params: {
        conversion,
        dealSize,
      },
  });
  console.log(res.data);
  setData(res.data);

};

return(
  <div style={{padding: "20px"}}>

    <h1>What-If Simulation Engine</h1>

    <div>

      <input type="number" placeholder="Enter Conversion change: " onChange={(e)=>setConversion(Number(e.target.value))}/>
      <input type="number" placeholder="Enter Deal change: " onChange={(e)=>setDealSize(Number(e.target.value))}/>


      <button onClick={runSimulation}>Run</button>
    </div>
  {data && (
        <div style={{ marginTop: "20px" }}>
          <h3>Results</h3>

          <p>Baseline Revenue: ₹{data.baseline.toFixed(2)}</p>
          <p>Scenario Revenue: ₹{data.scenario.toFixed(2)}</p>
          <p>Impact: ₹{data.impact.toFixed(2)}</p>

          <hr />

          <h4>Insights</h4>
          <p>
            Revenue changed by{" "}
            {((data.impact / data.baseline) * 100).toFixed(2)}%
            due to changes in conversion rate and deal size.
          </p>
        </div>
      )}
      </div>
  );
}
export default App;

