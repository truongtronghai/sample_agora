window.onload = function () {
  // Buttons
  document.getElementById("selectedExample").onclick = async function () {
    example = document.getElementById("selectedExample").value.toString();
    console.log(example);
    switch (example) {
      case "getStarted":
        window.location.assign("/sdk_quickstart/");
        return;
      case "authenticationGuide":
        window.location.assign("/authentication_guide")
      default:
        return null;
    }
  };
};
