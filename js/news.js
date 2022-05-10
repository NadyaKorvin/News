//переменные поля ввода
let inputText = "";
let inputCategory = "";
let inputTitle = "";
//переменная поля ввода, слушатель ввода
let addNewsInput = document.querySelector(".input__add_news");
addNewsInput.addEventListener("input", (event) => listenNewsText(event));
//слушатель заголовка
let addTitle = document.querySelector(".input__add_title");
addTitle.addEventListener("input", (event) => listenTitle(event));
//переменная категории
let categoryInSelect = document.querySelector(".category");
categoryInSelect.addEventListener("click", (event) =>
  listenCategoryInSelect(event)
);
//переменная кнопки добавить, слушатель клика. Привязаны функция создания  строчек задач и ф-я для добавления слушателей в эти строчки)
let addNewsButton = document.querySelector(".button__add_news");
addNewsButton.addEventListener("click", (event) => callPostNewNews(event));

//Получени новостей с сервера
let getAllNews = async () => {
  const response = await fetch("http://24api.ru/rest-news", {
    method: "GET",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(),
  });
  return await response.json();
};
//ф-я для отрисовки новости
let createNewsLine = (body, id) => {
  let newsBlock = document.querySelector(".news__block");
  let newsLine = document.createElement("div");
  newsBlock.append(newsLine);
  newsLine.className = "news__line";
  newsLine.insertAdjacentHTML("afterBegin", "<p>" + body + "</p>");
  newsLine.insertAdjacentHTML(
    "beforeEnd",
    "<div class='label_" + id + "'></div>"
  );
};
// вызов отрисовки новостей с сервера
let callGetFromApiNews = async () => {
  getAllNews().then((obj) => {
    obj.forEach((elem) => {
      createNewsLine(elem.body, elem.category_id);
    });
  });
};
callGetFromApiNews();
//получение категорий с сервера
let getAllCategory = async () => {
  const response = await fetch("http://24api.ru/rest-news-category", {
    method: "GET",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(),
  });
  return await response.json();
};
//добавление категории в select. вызывается при получении данных с сервера
let createCategoryInSelect = (name, id) => {
  let select = document.querySelector(".category");
  select.insertAdjacentHTML(
    "beforeEnd",
    "<option class='category__option' value=" + id + ">" + name + "</option>"
  );
};
//рисуем кнопочки каетгорий
let createCategoryButton = async (id, name) => {
  let checkCategory = document.querySelector(".check__category");
  checkCategory.insertAdjacentHTML(
    "afterBegin",
    "<button class='num_" + id + "'>" + name + "</button>"
  );
};
//навешивание слушателей
let putListenersOnCategoryButton = async (id) => {
  let categoryButton = document.querySelector(`.num_${id}`);
  categoryButton.addEventListener("click", (event) => choseCategory(event));
};
//вызов функций отрисовки  слушателей после приема данных
let callGetFromApiCategory = async () => {
  getAllCategory().then((obj) => {
    obj.forEach((elem) => {
      createCategoryInSelect(elem.name, elem.id);
      createCategoryButton(elem.id, elem.name);
      putListenersOnCategoryButton(elem.id);
    });
  });
};
callGetFromApiCategory();

//отправка данных о новой задаче
const postNewNews = async (inputTitle, inputText, inputCategory) => {
  const response = await fetch("http://24api.ru/rest-news", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      title: inputTitle,
      body: inputText,
      category_id: inputCategory,
    }),
  });
  return await response.json();
};
//ф-я палучения инпута из поля ввода, вызывается событием ввода
const listenNewsText = (event) => {
  inputText = event.target.value;
};
const listenCategoryInSelect = (event) => {
  inputCategory = event.target.value;
};
const listenTitle = (event) => {
  inputTitle = event.target.value;
};
//ф-я получения данных из инпута при нажатии кнопк Добавить и запуск отправки новыой задачи на сервер
const callPostNewNews = (event) => {
  inputCategory = event.target.previousSibling.previousSibling.value;
  inputText =
    event.target.previousSibling.previousSibling.previousSibling.previousSibling
      .value;
  inputTitle =
    event.target.previousSibling.previousSibling.previousSibling.previousSibling
      .previousSibling.previousSibling.value;
  postNewNews(inputTitle, inputText, inputCategory).then((tasks) => {
    createNewsLine(tasks.body, tasks.category_id);
  });
};

let choseCategory = async (event) => {
  let sort = {};
  let tmp = event.target.className;
  document.querySelector(".news__block").innerHTML = "";
  getAllNews().then((obj) => {
    sort = obj.filter((elem) => tmp.includes(elem.category_id));
    sort.forEach((elem) => {
      createNewsLine(elem.body, elem.category_id);
    });
  });
};
