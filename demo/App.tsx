import { createMemo, createSignal } from "solid-js";
import SolidIcon from "../tests/fixtures/solid.svg?solid";

const App = () => {
  const [n, setn] = createSignal(1);
  setInterval(() => {
    setn((last) => last + 1);
  }, 1000);
  const cls = createMemo(() => "icon no-" + n());

  return (
    <>
      <h1>This is a simple demo</h1>
      <SolidIcon
        aria-hidden="false"
        class={cls()}
        fill="none"
        style={{ color: "deepskyblue", width: "16rem", height: "auto" }}
      />
    </>
  );
};

export default App;
