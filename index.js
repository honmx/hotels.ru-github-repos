const form = document.querySelector(".form");
const responseArea = document.querySelector(".response");
const baseURL = "https://api.github.com/search/repositories";

const fetchRepositoriesByName = async (name) => {
  const response = await fetch(`${baseURL}?q=${name}&per_page=10`);

  if (!response.ok) throw new Error("An error occured");

  const result = await response.json();
  return result;
}

const addLoading = () => {
  const spinner = document.createElement("div");
  spinner.classList.add("response__spinner", "spinner");
  spinner.innerHTML = `
    <div class="spinner__blob blob top"></div>
    <div class="spinner__blob blob bottom"></div>
    <div class="spinner__blob blob left"></div>
    <div class="spinner__blob blob move-blob"></div>
  `;
  responseArea.append(spinner);
}

const removeLoading = () => {
  const spinner = document.querySelector(".spinner");
  spinner.remove();
}

const createListOfResults = (data) => {
  const list = document.createElement("ul");
  list.classList.add("response__list");

  data.forEach(item => {
    list.innerHTML += `
      <li class="response__item item">
        <div class="item__repos-info">
          <a target="_blank" class="item__repos-link link" href="${item.html_url}">${item.name}</a>
          ${item.language ? `<p class="item__language">${item.language}</p>` : ""}
          <p class="item__stars">Stars: ${item.stargazers_count}</p>
          <p class="item__created-at">${new Date(item.created_at).toLocaleDateString()}</p>
        </div>
        <div class="item__user-info">
          <a target="_blank" href="${item.owner.html_url}" class="item__profile-link link">
            <img src="${item.owner.avatar_url}" alt="logo" class="item__user-avatar">
            <span class="item__user-name">${item.owner.login}</span>
          </a>
        </div>
      </li>
    `;
  });

  return list;
}

const createNotFoundMessage = () => {
  const p = document.createElement("p");
  p.classList.add("response__not-found", "error");
  p.innerHTML = "Not Found";
  return p;
}

const createErrorMessage = (error) => {
  const errorElem = document.createElement("p");
  errorElem.classList.add("response__error", "error");
  errorElem.innerHTML = error.message;
  return errorElem;
}

const throwValidationError = () => {
  const error = document.createElement("p");
  error.classList.add("form__error", "error");
  error.innerHTML = "Type at least 4 characters";
  form.append(error);
}

const clearResponseArea = () => {
  responseArea.innerHTML = "";
}

// ===========================================

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputText = form.text.value;
  form.text.value = "";

  if (inputText.length < 4) {
    throwValidationError();
    return;
  }

  clearResponseArea();
  addLoading();

  try {
    const data = await fetchRepositoriesByName(inputText);

    const result = data.items.length > 0
      ? createListOfResults(data.items)
      : createNotFoundMessage();

    responseArea.append(result);
  } catch (err) {
    const error = createErrorMessage(err);
    responseArea.append(error);
  }

  removeLoading();
});

form.onkeydown = (e) => document.querySelector(".form__error")?.remove();