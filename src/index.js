import PouchDB from "pouchdb";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "use-pouchdb";
import App from "./App";

const db = new PouchDB("expense-tracker");
// const remoteDb = new PouchDB('');

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider default="expense-tracker" databases={{ local: db }}>
      <App />
    </Provider>
  </React.StrictMode>
);
