let currentPage = 1;
const ITEMS_PER_PAGE = 2;

const elements = {
    category: document.getElementById('filterCategory'),
    branch: document.getElementById('filterBrand'),
    search: document.getElementById('searchTitle'),
    status: document.getElementById('filterStatus'),
    tags: document.getElementById('filterTags'),
    sort: document.getElementById('sortPrice'),
    paging: document.getElementById('paging'),
    productList: document.getElementById('productList'),
};

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    setupPaginationListener();
    setupFilterListeners();
}

function setupPaginationListener() {
    elements.paging.addEventListener('click', handlePaginationClick);
}

function setupFilterListeners() {
    elements.category.addEventListener('change', () => sendAjaxRequest());
    elements.branch.addEventListener('change', () => sendAjaxRequest());
    elements.tags.addEventListener('change', () => sendAjaxRequest());
    elements.sort.addEventListener('change', () => sendAjaxRequest());
    elements.search.addEventListener('input', debounce(() => sendAjaxRequest(), 300));
    elements.status.addEventListener('change', () => sendAjaxRequest());
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

async function sendAjaxRequest() {
    try {
        const filters = getFilterData();
        const response = await fetch(`/admin/filter?${filters}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const html = await response.text();
        updateDOM(html);
        updateUrl(filters);
        setBgImages(); // Assuming this is defined elsewhere
    } catch (error) {
        console.error('Filter request failed:', error);
    }
}

function updateDOM(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const sections = ['productList', 'paging'];

    sections.forEach(section => {
        const newElement = doc.querySelector(`#${section}`);
        const currentElement = elements[section];
        if (newElement && currentElement) {
            currentElement.innerHTML = newElement.innerHTML;
        }
    });
}

function getFilterData() {
    const params = new URLSearchParams();

    if (elements.category.value) params.append('category', elements.category.value);
    if (elements.branch.value) params.append('branch', elements.branch.value);
    if (elements.tags.value) params.append('tags', elements.tags.value);
    if (elements.status.value) params.append('status', elements.status.value);
    if (elements.sort.value) params.append('sort', elements.sort.value);
    if (elements.search.value) params.append('search', elements.search.value);

    params.append('page', currentPage);
    params.append('limit', ITEMS_PER_PAGE);

    return params.toString();
}

// Debounce để giảm số lượng request khi nhập liệu nhanh
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function updateUrl(filters) {
    const newUrl = `/admin/filter?${filters}`;
    history.replaceState(null, '', newUrl);
}

function setBgImages() {
    document.querySelectorAll('.set-bg').forEach(el => {
        const bg = el.getAttribute('data-setbg');
        el.style.backgroundImage = `url(${bg})`;
    });
}