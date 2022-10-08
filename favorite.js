const dataPanel = document.querySelector("#data-panel");
const list = JSON.parse(localStorage.getItem("FavoriteList")) || [];
const rmvBtn = document.querySelector(".btn-rmv-favorite");
const paginator = document.querySelector("#paginator");
const personPerPage = 24;
function renderPeopleList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    // full name, image
    rawHTML += `<div class="col-8 col-lg-2">
      <div class="mb-2">
        <div class="card">
          <img src="${item.avatar}" class="card-img-top" alt="Person Picture">
          <div class="card-body">
            <h6 class="card-title">${item.name} ${item.surname}</h6>
          </div>
          <div class="card-footer align-content-center">
            <button class="btn btn-primary btn-show-people" data-bs-toggle="modal" data-bs-target="#people-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-rmv-favorite">X</button>
          </div>
        </div>
      </div>
    </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}
// console.log(list);
if (list.length == 0) {
  dataPanel.innerHTML = `<div class="col-sm-12"><h3 class="text-center" >Please add friends from home page</h3></div>`;
} else {
  renderPage(list);
  renderPeopleList(showPeoplePerPage(1));
}

dataPanel.addEventListener("click", (event) => {
  if (event.target.matches(".btn-show-people")) {
    showPeopleModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-rmv-favorite")) {
    let findId = event.target.previousElementSibling.dataset.id; //也可以在button的標籤中放入data-id，就不需要加previousElementSibling
    removeFromFavorite(Number(findId)); //dataset抓來的id，Number要加啊啊啊啊啊啊
  }
});

function removeFromFavorite(id) {
  const targetPerson = list.find((el) => el.id === id);
  list.splice(list.indexOf(targetPerson), 1); //splice會直接對原本的list執行，不會回傳新的array
  renderPeopleList(list);
  localStorage.setItem("FavoriteList", JSON.stringify(list));
}

//Paginator

function showPeoplePerPage(page) {
  const startIndex = (page - 1) * personPerPage;
  return list.slice(startIndex, startIndex + personPerPage);
}

function renderPage(arr) {
  const numberOfPages = Math.ceil(arr.length / personPerPage);
  let rawHTML = ``;
  for (i = 1; i <= numberOfPages; i++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

paginator.addEventListener("click", function showPage(event) {
  let findPage = Number(event.target.innerText);
  renderPeopleList(showPeoplePerPage(findPage));
});
