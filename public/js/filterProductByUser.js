let currentPage = 1;
const ITEMS_PER_PAGE = 2;

const elements = {
    filterForm: document.getElementById('filterForm'),
    search: document.getElementById('search'),
    sortContainer: document.querySelector('div[class="shop__product__option__right"]'),
    paging: document.getElementById('paging'),
    productList: document.getElementById('productList'),
    countProduct: document.getElementById('countProduct')
};

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    setupSortObserver();
    setupPaginationListener();
    setupFilterListeners();
}

function setupSortObserver() {
    const observer = new MutationObserver(() => sendAjaxRequest());
    observer.observe(elements.sortContainer, { childList: true, subtree: true });
}

function setupPaginationListener() {
    elements.paging.addEventListener('click', handlePaginationClick);
}

function setupFilterListeners() {
    elements.filterForm.addEventListener('change', () => sendAjaxRequest());
    elements.search.addEventListener('input', () => sendAjaxRequest());
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
        const response = await fetch(`/filter?${filters}`, {
            method: 'GET',
            headers: { 'Content-Type': 'text/html' }
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
    const sections = ['productList', 'countProduct', 'paging'];
    
    sections.forEach(section => {
        const newElement = doc.querySelector(`#${section}`);
        const currentElement = elements[section];
        if (newElement && currentElement) {
            currentElement.innerHTML = newElement.innerHTML;
        }
    });
}

function getFilterData() {
    const filters = new URLSearchParams();
    const formData = new FormData(elements.filterForm);
    const sortText = document.querySelector('span[class="current"]').textContent;

    // Add basic filters
    filters.append('page', currentPage);
    filters.append('limit', ITEMS_PER_PAGE);
    filters.append('search', elements.search.value);
    
    // Add sort filter
    const sortValue = getSortValue(sortText);
    if (sortValue) filters.append('sort', sortValue);

    // Process form data
    formData.forEach((value, key) => {
        if (key === 'price') {
            addPriceFilter(filters, value);
        } else {
            filters.append(key, value);
        }
    });

    return filters.toString();
}

function getSortValue(sortText) {
    const sortMap = {
        'High To Low': 'DESC',
        'Low To High': 'ASC'
    };
    return sortMap[sortText];
}

function addPriceFilter(filters, priceRange) {
    const [min, max] = priceRange.replaceAll('$', '').split('-');
    if (min) filters.append('min', min);
    if (max) filters.append('max', max);
}

function updateUrl(filters) {
    const newUrl = `/filter?${filters}`;
    history.replaceState(null, '', newUrl);
}

function setBgImages() {
    document.querySelectorAll('.set-bg').forEach(el => {
        const bg = el.getAttribute('data-setbg');
        el.style.backgroundImage = `url(${bg})`;
    });
}