import { App } from "./app.js";

let isHostedOnGithub = false;
if (window.location.host.includes("github")) {
  isHostedOnGithub = true;
}

const app = new App(isHostedOnGithub);
