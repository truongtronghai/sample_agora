import projectSelector from "./utils/projectSelector.js";

window.onload = async function () {
  // sleep
  await new Promise(r => setTimeout(r, 2000));
  // Buttons
  document.getElementById("selectedExample").onclick = async function () {
    projectSelector();
  };
};
