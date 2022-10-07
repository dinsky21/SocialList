const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const USER_URL = BASE_URL + "/api/v1/users/";
const formInput = document.querySelector("#search-form");
const inputValue = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-submit-button");
const people = [];
let filteredList = [];

// 函式，將陣列內的資料取出放入HTML的card中
const dataPanel = document.querySelector("#data-panel");

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
// localStorage.clear();

// 將API中data.results放進people陣列中
axios
  .get(USER_URL)
  .then((response) => {
    people.push(...response.data.results);
    renderPeopleList(people);
  })
  .catch((err) => console.log(err));

// 客製化 Modal 元件  在HTML頁面中
// 動態綁定按鈕的點擊事件 (click events)
dataPanel.addEventListener("click", (event) => {
  if (event.target.matches(".btn-show-people")) {
    showPeopleModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    let findId = event.target.previousElementSibling.dataset.id; //也可以在button的標籤中放入data-id，就不需要加previousElementSibling
    addToFav(Number(findId));
  }
});
// 取出特定電影的 id 資訊
// 向 Show API request 資料
function showPeopleModal(id) {
  const modalName = document.querySelector("#people-modal-name");
  const modalImage = document.querySelector("#people-modal-image");
  const modalOrigin = document.querySelector("#people-modal-origin");
  const modalBday = document.querySelector("#people-modal-birthday");
  axios.get(USER_URL + id).then((response) => {
    const data = response.data;
    modalName.innerText = data.name + " " + data.surname;
    modalOrigin.innerText = "Come from : " + data.region;
    modalBday.innerText = "Birthday : " + data.birthday;
    modalImage.innerHTML = `<img src="${data.avatar}" alt="people-poster" class="img-fluid">`;
  });
}

// 1. 將搜尋表單綁定提交事件，觸發搜尋功能
// form 本身有submit這個事件，所以我們可用以監聽，並設定event handler為filterPeople
formInput.addEventListener("submit", function filterPeople(event) {
  event.preventDefault();
  // 2. 取得搜尋框中使用者輸入的關鍵字
  const keyword = inputValue.value.trim().toLowerCase(); //要取出輸入的值，需要用.value放進新變數
  // 3. 比對搜尋關鍵字與電影標題
  filteredList = people.filter(
    (el) =>
      el.name.toLowerCase().includes(keyword) ||
      el.surname.toLowerCase().includes(keyword)
  );
  // 4. 將匹配結果回傳到網頁畫面上
  if (filteredList.length) {
    renderPeopleList(filteredList);
    inputValue.value = "";
  }
  //4-1.若輸入空白鍵或是關鍵字無法匹配，keyword會直接被刪除，並且列出所有人
  else {
    renderPeopleList(people);
    alert("Cannot find matching people");
    inputValue.value = "";
  }
});

//建立加為好友清單的功能
function addToFav(id) {
  let plist = JSON.parse(localStorage.getItem("FavoriteList")) || [];
  let favPerson = people.find((el) => el.id === id);
  if (plist.some((el) => el.id === id)) {
    return alert("this person already added");
  }
  plist.push(favPerson);
  localStorage.setItem("FavoriteList", JSON.stringify(plist));
}
