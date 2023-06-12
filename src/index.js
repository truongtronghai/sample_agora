window.onload = function () {
  // Buttons
  document.getElementById("selectedExample").onclick = async function () {
    example = document.getElementById("selectedExample").value.toString();
    console.log(example);
    switch (example) {
      case "getStarted":
        window.location.assign("/sdk_quickstart/");
        return;
        case "readWriteMetadata":
          window.location.assign("/read_write_metadata/");
          return;
      default:
        return null;
    }
  };
};
