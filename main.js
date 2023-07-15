// Variables

let circles = document.querySelectorAll(".sideBar .circle");
let steps = document.querySelectorAll("main .step");
let inputs1 = document.querySelectorAll(".step-1 input");
let labels1 = document.querySelectorAll(".step-1 label");
let inputs2 = document.querySelectorAll(".step-2 .plans input");
let price2 = document.querySelectorAll(".step-2 .plans span");
let free2 = document.querySelectorAll(".step-2 .plans p");
let toggle = document.querySelector(".step-2 .period input");
let price3 = document.querySelectorAll(".step-3 label .price");
let inputs3 = document.querySelectorAll(".step-3 label input");
let nxtBtn = document.querySelectorAll(".next");
let backBtn = document.querySelectorAll(".back");
let nav = document.querySelectorAll(".nav");

let plan4 = document.querySelector(".step-4 .plan h4");
let planPrice4 = document.querySelector(".step-4 .planMoney");
let addOns4 = document.querySelector(".step-4 .addOns");
let total = document.querySelector(".step-4 .total span");
let totalPrice = document.querySelector(".step-4 .total .price");

let curStep = 0;
let userData = {};

let vali = (i) => i.checkValidity();

// Events

nxtBtn.forEach(
  (e) =>
    (e.onclick = () => {
      if (validate()) {
        updateData();
        next();
      }
    })
);

backBtn.forEach((e) => (e.onclick = back));

toggle.onchange = togglePrice;

if (localStorage.getItem("data")) {
  uploadStorage(JSON.parse(localStorage.getItem("data")));
}

// Functions

function validate() {
  if (curStep == 0) {
    inputs1.forEach((i, e) => {
      if (i.checkValidity()) {
        labels1[e].classList.remove("empty");
        labels1[e].classList.remove("invalid");
      } else {
        if (i.value) {
          labels1[e].classList.remove("empty");
          labels1[e].classList.add("invalid");
        } else {
          labels1[e].classList.remove("invalid");
          labels1[e].classList.add("empty");
        }
      }
    });
    if ([...inputs1].every(vali)) {
      return true;
    } else return false;
  } else if (curStep == 1) {
    let checked = document.querySelector(".step-2 .plans input:checked");
    if (checked) {
      steps[1].classList.remove("notchoosen");
      return true;
    } else {
      steps[1].classList.add("notchoosen");
      return false;
    }
  } else {
    return true;
  }
}

function next() {
  nav[curStep].style.display = "none";
  circles[curStep].classList.remove("active");
  steps[curStep++].style.display = "none";
  steps[curStep].style.display = "block";
  if (curStep == 3) printResult(userData);
  if (curStep == 4) {
    steps[4].style.display = "flex";
  } else {
    circles[curStep].classList.add("active");
    nav[curStep].style.display = "flex";
  }
}

function back() {
  nav[curStep].style.display = "none";
  circles[curStep].classList.remove("active");
  steps[curStep--].style.display = "none";
  steps[curStep].style.display = "block";
  circles[curStep].classList.add("active");
  nav[curStep].style.display = "flex";
}

function togglePrice(e = true) {
  if (toggle.checked) {
    price2.forEach((p, i) => {
      let monthly = +p.innerHTML.match(/\d{1,}/)[0];
      p.innerHTML = `$${monthly * 10}/yr`;
      free2[i].style.display = "block";

      let add = +price3[i].innerHTML.match(/\d{1,}/)[0];
      price3[i].innerHTML = `$${add * 10}/yr`;
    });
  } else {
    if (e) {
      price2.forEach((p, i) => {
        let yearly = +p.innerHTML.match(/\d{1,}/)[0];
        p.innerHTML = `$${yearly / 10}/mo`;
        free2[i].style.display = "none";

        let add = +price3[i].innerHTML.match(/\d{1,}/)[0];
        price3[i].innerHTML = `$${add / 10}/mo`;
      });
    }
  }
}

function updateData() {
  if (curStep == 0) {
    userData.Name = inputs1[0].value;
    userData.Email = inputs1[1].value;
    userData.Phone = inputs1[2].value;
  } else if (curStep == 1) {
    let plan = document.querySelector(".step-2 .plans input:checked");
    let p = document.querySelector(".step-2 .plans :has(input:checked) span");
    userData.Plan = plan.value;
    userData.PlanType = toggle.checked ? "Yearly" : "Monthly";
    userData.PlanPrice = p.innerText;
  } else if (curStep == 2) {
    let addOnI = document.querySelectorAll(".step-3 label input:checked");
    if (addOnI) {
      let addOnIndex = [...addOnI].map((e) => e.value);

      let prices = ["1/mo", "2/mo", "2/mo"];
      if ((userData.PlanType == "Yearly")) prices = ["20/yr", "20/yr", "20/yr"];

      let names = ["Online service", "Larger storage", "Customizable Profile"];

      userData.AddOns = [];
      addOnIndex.forEach((i) => {
        userData.AddOns.push({
          name: names[i],
          price: prices[i],
          index: i,
        });
      });
    }
  }
  console.log(userData);
  localStorage.setItem("data", JSON.stringify(userData));
}

function printResult(data) {
  plan4.innerHTML = `${data.Plan} (${data.PlanType})`;
  planPrice4.innerHTML = `${data.PlanPrice}`;

  let pt = +data.PlanPrice.match(/\d{1,}/)[0];
  addOns4.innerHTML = "";
  for (let o of data.AddOns) {
    let div = document.createElement("div");
    let span1 = document.createElement("span");
    let span2 = document.createElement("span");
    span1.innerHTML = o.name;
    span2.innerHTML = "+$" + o.price;
    div.append(span1, span2);
    addOns4.appendChild(div);

    pt += +o.price.match(/\d{1,}/)[0];
  }

  total.innerHTML = `Total (per ${
    data.PlanType == "Yearly" ? "year" : "month"
  })`;
  totalPrice.innerHTML = `$${pt}/${data.PlanType == "Yearly" ? "yr" : "mo"}`;
}

function uploadStorage(data) {
  inputs1[0].value = data.Name;
  inputs1[1].value = data.Email;
  inputs1[2].value = data.Phone;
  if (data.PlanType == "Yearly") toggle.setAttribute("checked", "");
  togglePrice(false);
  inputs2.forEach((i) => {
    if (i.value == data.Plan) i.setAttribute("checked", "");
  });
  for (let o of data.AddOns) {
    inputs3[o.index].setAttribute("checked", "");
  }
}

// Media query

function myFunction(x) {
  if (x.matches) {
    document.body.append(...nav);
    nav.forEach((e, i) => {
      if (i == 0) e.style.justifyContent = "flex-end";
      if (i == 3) e.children[1].style.backgroundColor = "hsl(243, 100%, 62%)";
      e.style.display = "none";
      if (i == curStep) e.style.display = "flex";
      e.style.backgroundColor = "white";
      e.style.padding = "20px 15px";
    });
  } else {
    steps.forEach((e, i) => {
      nav.forEach((u, o) => {
        u.style.padding = "0";
        if (o == i) e.appendChild(u);
      });
    });
  }
}
let x = window.matchMedia("(max-width: 540px)");
myFunction(x);
x.addEventListener("change", myFunction);
