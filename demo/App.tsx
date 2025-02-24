import SolidIcon from "../src/solid.svg?solid";

const App = () => {
  return (
    <>
      <h1>This is a simple demo</h1>
      <SolidIcon
        aria-hidden="false"
        class="icon"
        fill="none"
        style={{ color: "deepskyblue", width: "16rem", height: "auto" }}
      />
    </>
  );
};

export default App;
