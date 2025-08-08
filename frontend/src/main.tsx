import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import Loader from "./loader";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Loader></Loader>
  </Provider>
);
