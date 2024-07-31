import App from "./App";
import ReactDOM from "react-dom/client";
import store from "@/redux/store";
import "./global.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    <Provider store={store}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            marginTop: "70px",
          },
        }}
      />
      <App />
    </Provider>
  </Router>
);
