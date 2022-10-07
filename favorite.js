const dataPanel = document.querySelector("#data-panel");

const list = JSON.parse(localStorage.getItem("FavoriteList"));

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
            <button class="btn btn-info btn-add-favorite">+</button>
          </div>
        </div>
      </div>
    </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

renderPeopleList(list);
