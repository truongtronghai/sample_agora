const projectSelector = () => {
  let example = document.getElementById("selectedExample").value.toString();
  console.log(example);
  switch (example) {
    case "home":
      window.location.assign("/")
      return;
    case "getStarted":
      window.location.assign("/sdk_quickstart/");
      return;
    case "authenticationGuide":
      window.location.assign("/authentication_guide");
    default:
      return null;
  }
};

export default projectSelector;
