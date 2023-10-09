document.getElementById("logout").addEventListener("click", async () => {
  try {
    alert("hello");
    await localStorage.clear();
    window.location.href = "/";
  } catch (err) {
    // console.log(err);
    alert("some error occured");
  }
});
