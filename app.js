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
    rawHTML += `<div class='col-8 col-lg-2'>
    <div class='mb-2'>
      <div class='card'>
        <img src='${item.avatar}' class='img-fluid card-img-top' alt='Person Picture'>
        <div class='card-body'>
          <h6 class='card-title'>${item.name} ${item.surname}</h6>
        </div>
        <div class='card-footer align-content-center'>
          <button class='btn btn-primary btn-show-people' data-bs-toggle='modal' data-bs-target='#people-modal' data-id='${item.id}'>More</button>
          <button class='btn btn-info btn-add-favorite'>+</button>
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
    renderPage(people);
    renderPeopleList(showPeoplePerPage(1));
    inputValue.value = "";
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
    modalImage.innerHTML = `<img src='${data.avatar}' alt='people-poster' class='img-fluid'>`;
  });
}

inputValue.addEventListener("keyup", function filterPeople(event) {
  event.preventDefault();

  const keyword = inputValue.value.trim().toLowerCase();
  if (keyword == "") {
    inputValue.value = "";
    return;
  } else {
    filteredList = people.filter(
      (el) =>
        el.name.toLowerCase().includes(keyword) ||
        el.surname.toLowerCase().includes(keyword)
    );
  }
  if (filteredList.length) {
    renderPage(filteredList);
    renderPeopleList(showPeoplePerPage(1));
  } else {
    renderPeopleList(people);
    alert("Cannot find matching people");
    inputValue.value = "";
  }
});

// // 1. 將搜尋表單綁定提交事件，觸發搜尋功能
// // form 本身有submit這個事件，所以我們可用以監聽，並設定event handler為filterPeople
// formInput.addEventListener('submit', function filterPeople(event) {
//   event.preventDefault();
//   // 2. 取得搜尋框中使用者輸入的關鍵字
//   const keyword = inputValue.value.trim().toLowerCase(); //要取出輸入的值，需要用.value放進新變數
//   // 3. 比對搜尋關鍵字與電影標題
//   filteredList = people.filter(
//     (el) =>
//       el.name.toLowerCase().includes(keyword) ||
//       el.surname.toLowerCase().includes(keyword)
//   );
//   // 4. 將匹配結果回傳到網頁畫面上
//   if (filteredList.length) {
//     renderPage(filteredList);
//     renderPeopleList(showPeoplePerPage(1));
//     inputValue.value = '';
//   }
//   //4-1.若輸入空白鍵或是關鍵字無法匹配，keyword會直接被刪除，並且列出所有人
//   else {
//     renderPeopleList(people);
//     alert('Cannot find matching people');
//     inputValue.value = '';
//   }
// });

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

//Paginator
const paginator = document.querySelector("#paginator");
const personPerPage = 24;

function showPeoplePerPage(page) {
  let data = filteredList.length ? filteredList : people; //
  const startIndex = (page - 1) * personPerPage;
  return data.slice(startIndex, startIndex + personPerPage);
}
// function showFilteredPeoplePerPage(page) {
//   const startIndex = (page - 1) * personPerPage;
//   return filteredList.slice(startIndex, startIndex + personPerPage);
// }

function renderPage(arr) {
  const numberOfPages = Math.ceil(arr.length / personPerPage);
  let rawHTML = ``;
  for (i = 1; i <= numberOfPages; i++) {
    rawHTML += `<li class='page-item'><a class='page-link' href='#'>${i}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

paginator.addEventListener("click", function showPage(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== "A") return;
  let findPage = Number(event.target.innerText);
  renderPeopleList(showPeoplePerPage(findPage));
});

//Sort 按名字和出生年份
const sortName = document.querySelector("#sort-by-name");
const sortYear = document.querySelector("#sort-by-birth-year");
function sortByName(arr) {
  arr.sort(function (a, b) {
    let nameA = a.name.toLowerCase();
    let nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    } else 0;
  });
}

sortName.addEventListener("click", function (event) {
  event.preventDefault();
  let data = filteredList.length ? filteredList : people;
  sortByName(data);
  renderPage(data);
  renderPeopleList(showPeoplePerPage(1));
});

sortYear.addEventListener("click", function (event) {
  event.preventDefault();
  let data = filteredList.length ? filteredList : people;

  data.sort(function (a, b) {
    let dateA = new Date(a.birthday),
      dateB = new Date(b.birthday);
    return dateB - dateA;
  });
  renderPage(data);
  renderPeopleList(showPeoplePerPage(1));
});
