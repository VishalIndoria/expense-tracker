const form = document.getElementById("form");
const ulTag = document.getElementById("users");
const nextbtn = document.getElementById("next");
const previousbtn = document.getElementById("previous");
const currentPage = localStorage.setItem("currentPage", 1);

form.addEventListener("submit", saveToDatabase);

async function saveToDatabase(e) {
  try {
    e.preventDefault();
    const amountValue = e.target.amount.value;
    const descriptionValue = e.target.description.value;
    const categoryValue = e.target.category.value;

    const datee = new Date();
    const day = datee.getDate();
    const month = datee.getMonth() + 1;
    const year = datee.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    const fullDate = formattedDay + "/" + formattedMonth + "/" + year;
    // console.log("date", fullDate);
    const obj = {
      amount: amountValue,
      description: descriptionValue,
      category: categoryValue,
      datee: fullDate,
    };
    const token = localStorage.getItem("accessToken");
    const response = await axios.post("/add-expense", obj, {
      headers: { Authorization: token },
    });
    const res = response.data.expense;
    addItem(res);
  } catch (err) {
    // console.log(err);
    alert(err);
  }
}
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function showPremium() {
  const buyButton = document.getElementById("Premium");
  buyButton.remove();
  const premiumMessage = document.getElementById("Premium1");
  premiumMessage.style.display = "inline-block";
  premiumMessage.innerHTML = "Premium User &#128081 ";
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const decodedToken = parseJwt(token);
    const ispremium = decodedToken.ispremiumuser;

    if (ispremium) showPremium();

    const response = await axios.get("/fetchData", {
      headers: { Authorization: token },
    });
    for (var i = 0; i < response.data.length; i++) {
      const obj = response.data[i];
      addItem(obj);
    }
  } catch (error) {
    alert("something went wrong", error.message);
  }
});

// add list on display and delete functionality
function addItem(obj) {
  const id = obj.id;
  const date = obj.date;
  const categoryValue = obj.category;
  const descriptionValue = obj.description;
  const amountValue = obj.amount;
  const tableBody = document.getElementById("tbodyId");

  let tr = document.createElement("tr");
  // tr.className = "trStyle";

  table.appendChild(tr);

  let idValue = document.createElement("th");
  idValue.setAttribute("scope", "row");
  idValue.setAttribute("style", "display: none");

  let th = document.createElement("th");
  th.setAttribute("scope", "row");

  tr.appendChild(idValue);
  tr.appendChild(th);

  idValue.appendChild(document.createTextNode(id));
  th.appendChild(document.createTextNode(date));

  let td1 = document.createElement("td");
  td1.appendChild(document.createTextNode(categoryValue));

  let td2 = document.createElement("td");
  td2.appendChild(document.createTextNode(descriptionValue));

  let td3 = document.createElement("td");
  td3.appendChild(document.createTextNode(amountValue));

  let deleteBtn = document.createElement("button");
  deleteBtn.className = "editDelete btn btn-danger delete";
  deleteBtn.appendChild(document.createTextNode("Delete"));

  let editBtn = document.createElement("button");
  editBtn.className = "editDelete btn btn-success edit";
  editBtn.appendChild(document.createTextNode("Edit"));

  let td5 = document.createElement("td");
  td5.appendChild(deleteBtn);
  td5.appendChild(editBtn);

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td5);
  tableBody.appendChild(tr);

  //delete
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = (e) => {
    deleteExpense(e, obj.id, obj.amount);
  };
}
////////////////////////////////
//////////////////////
/////////
///////
////
// delete functionality
async function deleteExpense(e, obj_id, amount) {
  try {
    const id = { obj_id, amount };
    const res = await axios.post("/delete-expense", id);
    window.location.reload();
  } catch (err) {
    alert(err.message);
  }
}
// razorpay integration
document.getElementById("Premium").addEventListener("click", async (e) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get("/api/purchaseMember", {
    headers: { Authorization: token },
  });
  // console.log(
  //   "response of get requesttttttttttttttttt/*/*/*/*/*/*/",
  //   response.data.order
  // );
  var options = {
    key: response.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: response.data.order.id, // For one time payment
    // This handler function will handle the success payment
    handler: async (response) => {
      const res = await axios.post(
        "/api/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );
      // console.log(options.handler);
      // console.log("oooooooooooooooooooooooooooooooooooooooooo", options);
      // alert('You are a Premium User Now')
      // showLeaderBoard()
    },
  };
  // alert(options.han)
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", async (response) => {
    try {
      const res = await axios.post(
        "/api/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_failed: true,
        },
        { headers: { Authorization: token } }
      );
      // console.log("rrrrrrrrrrrrrrrrr>>>>>>>>>>>>>", res);
      alert("something went wrong");
    } catch (err) {
      // console.log(err);
      alert(err);
    }
  });

  rzp1.on("payment.success", async (response) => {
    const id = req.user.id;
    const data = await axios.post("/getleader");
    // console.log(" data aagyo h expense js m line n. 235 p", data);
  });
});

// for leaderboard
const leaderboard = document.getElementById("showleaderboard");
leaderboard.onclick = checking;
const report = document.getElementById("showreport");
report.onclick = checking;
function checking() {
  const token = localStorage.getItem("accessToken");
  const decodedToken = parseJwt(token);
  // console.log(decodedToken);
  const ispremium = decodedToken.ispremiumuser;
  if (ispremium) {
    leaderboard.setAttribute("href", "/leader");
    report.setAttribute("href", "/report");
  } else alert("To Access This Feature, First Buy The Premium");
}
