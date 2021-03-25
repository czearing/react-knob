import { Knob } from "./Knob/Knob";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <Knob ticks={100} />
    </div>
  );
}
