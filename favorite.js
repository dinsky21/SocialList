const dataPanel = document.querySelector("#data-panel");
const list = JSON.parse(localStorage.getItem("FavoriteList"));
const rmvBtn = document.querySelector(".btn-rmv-favorite");

function renderPeopleList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    // full name, image
    rawHTML += `<div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${item.avatar}" class="card-img-top" alt="Person Picture">
          <div class="card-body">
            <h5 class="card-title">${item.name} ${item.surname}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-people" data-bs-toggle="modal" data-bs-target="#people-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-rmv-favorite">X</button>
          </div>
        </div>
      </div>
    </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

renderPeopleList(list);

dataPanel.addEventListener("click", (event) => {
  if (event.target.matches(".btn-show-people")) {
    showPeopleModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-rmv-favorite")) {
    let findId = event.target.previousElementSibling.dataset.id; //也可以在button的標籤中放入data-id，就不需要加previousElementSibling
    removeFromFavorite(Number(findId)); //dataset抓來的id，Number要加啊啊啊啊啊啊
    // console.log(list);
  }
});

function removeFromFavorite(id) {
  const targetPerson = list.find((el) => el.id === id);
  list.splice(list.indexOf(targetPerson), 1); //splice會直接對原本的list執行，不會回傳新的array
  renderPeopleList(list);
  localStorage.setItem("FavoriteList", JSON.stringify(list));
}
