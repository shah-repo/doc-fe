/* eslint-disable no-console */
import * as React from "react";
import { toast } from "react-toastify";
import Config from "../../config";
import "./consoleToaster.css";

const recentlySeenMessages = new Set<string>();

function wrapConsoleCall(callback, options: {class: string; title: string}) {
  // const x = callback;

  return function(...args) {
    const message: string = (args && args.length && args[0].toString()) || "Unknown warning in console!!";

    if (!recentlySeenMessages.has(message)) {
      toast(
        <div>
          <h4>{options.title}</h4>
          <p>{message}</p>
        </div>, {
          position: "bottom-right",
          autoClose: 10 * 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: `Toastify-console-log-common ${options.class}`,
        });
      recentlySeenMessages.add(message);
      setTimeout(() => {
        recentlySeenMessages.delete(message);
      }, 10 * 1000);
    }

    callback(...args);
  };
}

if (Config.consoleToastsEnabled) {
  console.error = wrapConsoleCall(console.error, { class: "Toastify-console-log-error", title: "Console Error" });
  console.warn = wrapConsoleCall(console.warn, { class: "Toastify-console-log-warn", title: "Console Warn" });
  console.info = wrapConsoleCall(console.info, { class: "Toastify-console-log-info", title: "Console Info" });
  // console.log = wrapConsoleCall(console.log, { class: "Toastify-console-log-log", title: "Console Log" });
}

