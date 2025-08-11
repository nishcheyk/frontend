import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import Lottie from "./lottie";
import Loader from "./loader";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />

    <Lottie></Lottie>
    <Loader />
  </Provider>
);
