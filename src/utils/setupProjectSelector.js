const setupProjectSelector = async () => {
  const resp = await fetch("/projectselector.html");
  console.log(resp);
  const html = await resp.text();
  document.getElementById("projectSelector").innerHTML = html;
};

export default setupProjectSelector;
