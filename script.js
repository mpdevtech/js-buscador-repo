const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const statusElement = document.querySelector("#status");
const resultsList = document.querySelector("#results-list");
const resultsCount = document.querySelector("#results-count");

const API_URL = "https://api.github.com/search/repositories";

searchForm.addEventListener("submit", handleSearch);

async function handleSearch(event) {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    showStatus("Digite uma palavra-chave antes de pesquisar.", "empty");
    return;
  }

  showLoading();

  try {
    const requestUrl = `${API_URL}?q=${encodeURIComponent(
      searchTerm,
    )}&sort=stars&per_page=10`;
    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error("Não foi possível completar a busca.");
    }

    const data = await response.json();

    if (data.items.length === 0) {
      showStatus(
        `Nenhum repositório encontrado para “${searchTerm}”. Tente outro termo.`,
        "empty",
      );
      return;
    }

    renderRepositories(data.items);
  } catch (error) {
    showStatus(
      "Não foi possível buscar os repositórios agora. Tente novamente em alguns instantes.",
      "error",
    );
  }
}

function showLoading() {
  clearResults();
  statusElement.className = "status";
  statusElement.replaceChildren();

  const spinner = document.createElement("div");
  spinner.className = "loading-spinner";
  spinner.setAttribute("aria-hidden", "true");

  const message = document.createElement("p");
  message.textContent = "Buscando repositórios...";

  statusElement.append(spinner, message);
  statusElement.classList.remove("hidden");
}

function showStatus(message, type) {
  clearResults();
  statusElement.className = `status ${type}`;

  const icon = createStatusIcon(type);
  const text = document.createElement("p");
  text.textContent = message;

  statusElement.replaceChildren(icon, text);
}

function createStatusIcon(type) {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.7");
  icon.setAttribute("aria-hidden", "true");
  icon.classList.add("status-icon");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    type === "error"
      ? "M12 9v4m0 4h.01M10.3 4.4 2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0Z"
      : "M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  );
  icon.append(path);

  return icon;
}

function renderRepositories(repositories) {
  clearResults();

  const fragment = document.createDocumentFragment();

  repositories.forEach((repository) => {
    fragment.append(createRepositoryCard(repository));
  });

  resultsList.append(fragment);
  resultsCount.textContent = `${repositories.length} ${
    repositories.length === 1 ? "repositório" : "repositórios"
  }`;
  statusElement.classList.add("hidden");
}

function createRepositoryCard(repository) {
  const card = document.createElement("article");
  card.className = "repository-card";

  const header = document.createElement("div");
  header.className = "repository-header";

  const avatar = document.createElement("img");
  avatar.className = "owner-avatar";
  avatar.src = repository.owner.avatar_url;
  avatar.alt = `Foto de ${repository.owner.login}`;
  avatar.width = 38;
  avatar.height = 38;
  avatar.loading = "lazy";

  const heading = document.createElement("div");
  heading.className = "repository-heading";

  const owner = document.createElement("span");
  owner.className = "owner-name";
  owner.textContent = repository.owner.login;

  const title = document.createElement("h3");
  title.className = "repository-name";

  const link = document.createElement("a");
  link.href = repository.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = repository.name;
  link.setAttribute(
    "aria-label",
    `Abrir o repositório ${repository.name} no GitHub`,
  );

  title.append(link);
  heading.append(owner, title);
  header.append(avatar, heading);

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent =
    repository.description || "Este repositório não possui descrição.";

  const metadata = document.createElement("p");
  metadata.className = "repository-meta";
  metadata.append(
    createMetadataItem(createCodeIcon(), repository.language || "Não informada"),
    createMetadataItem(
      createStarIcon(),
      `${repository.stargazers_count.toLocaleString("pt-BR")} estrelas`,
    ),
  );

  card.append(header, description, metadata);

  return card;
}

function createMetadataItem(icon, text) {
  const item = document.createElement("span");
  item.append(icon, document.createTextNode(text));
  return item;
}

function createCodeIcon() {
  return createSvgIcon("m8 9-3 3 3 3m8-6 3 3-3 3m-3-9-2 18");
}

function createStarIcon() {
  return createSvgIcon(
    "m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2-4.6-4.4 6.3-.9L12 2.8Z",
  );
}

function createSvgIcon(pathData) {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.8");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.setAttribute("aria-hidden", "true");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  icon.append(path);

  return icon;
}

function clearResults() {
  resultsList.replaceChildren();
  resultsCount.textContent = "";
}
