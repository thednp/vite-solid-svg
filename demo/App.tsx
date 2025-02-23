import SolidIcon from "../src/solid.svg?solid";
// import * as SOLID from "solid-js/h/jsx-runtime"

// console.log(SOLID)
const App = () => {
    return <>
        <h1>This is a simple demo</h1>
        <SolidIcon
            aria-hidden="false"
            class="icon"
            style={{ color: "deepskyblue", width: "16rem", height: 'auto' }}
        />
    </>
}

export default App;
