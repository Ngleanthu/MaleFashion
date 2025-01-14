let currentPage = 1;
const ITEMS_PER_PAGE = 2;

const elements = {
    searchField: document.getElementById('searchField'),
    search: document.getElementById('search'),
    filterRole: document.getElementById('filterRole'),
    sortField: document.getElementById('sortField'),
    sortType: document.getElementById('sortType'),
    filterStatus: document.getElementById('filterStatus'),
    paging: document.getElementById('paging'),
    accountList: document.getElementById('accountList'),
};

async function sendAjaxRequest() {
    try {
        const filters = getFilterData();
        const response = await fetch(`/admin/filterUser?${filters}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const html = await response.text();
        updateDOM(html);
        updateUrl(filters);
    } catch (error) {
        console.error('Filter request failed:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    setupPaginationListener();
    setupFilterListeners();
}

function setupPaginationListener() {
    elements.paging.addEventListener('click', handlePaginationClick);
}

function setupFilterListeners() {
    elements.searchField.addEventListener('change', () => sendAjaxRequest());
    elements.filterRole.addEventListener('change', () => sendAjaxRequest());
    elements.filterStatus.addEventListener('change', () => sendAjaxRequest());
    elements.sortField.addEventListener('change', () => sendAjaxRequest());
    elements.sortType.addEventListener('change', () => sendAjaxRequest());
    elements.search.addEventListener('input', debounce(() => sendAjaxRequest(), 300));
}

function handlePaginationClick(event) {
    if (event.target.tagName !== 'A') return;

    updateActivePage(event.target);
    sendAjaxRequest();
}

function updateActivePage(clickedLink) {
    currentPage = clickedLink.getAttribute('data-value');
    const allLinks = elements.paging.querySelectorAll('a');
    allLinks.forEach(link => link.classList.remove('active'));
    clickedLink.classList.add('active');
}

function updateDOM(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const sections = ['accountList', 'paging'];

    sections.forEach(section => {
        const newElement = doc.querySelector(`#${section}`);
        const currentElement = elements[section];
        if (newElement && currentElement) {
            currentElement.innerHTML = newElement.innerHTML;
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function updateUrl(filters) {
    const newUrl = `/admin/filterUser?${filters}`;
    history.replaceState(null, '', newUrl);
}

function getFilterData() {
    const searchField = elements.searchField.value;
    const searchTerm = elements.search.value;
    const filterRole = elements.filterRole.value;
    const sortField = elements.sortField.value;
    const sortType = elements.sortType.value;
    const filterStatus = elements.filterStatus.value;

    let filters = `page=${currentPage}&itemsPerPage=${ITEMS_PER_PAGE}`;

    if (searchField) filters += `&searchField=${searchField}`;
    if (searchTerm) filters += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    if (filterRole) filters += `&filterRole=${filterRole}`;
    if (sortField) filters += `&sortField=${sortField}`;
    if (sortType) filters += `&sortType=${sortType}`;
    if (filterStatus) filters += `&filterStatus=${filterStatus}`;

    return filters;
}
