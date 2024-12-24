document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openAddProductModal');
    const closeModalButton = document.getElementById('closeAddProductModal');
    const addProductModal = document.getElementById('addProductModal');
    const cancelAddProduct = document.getElementById('cancelAddProduct');

    // Open modal when "Thêm sản phẩm" button is clicked
    openModalButton.addEventListener('click', function() {
        addProductModal.classList.remove('hidden'); // Make the modal visible
    });

    // Close modal when "✖" button is clicked
    closeModalButton.addEventListener('click', function() {
        addProductModal.classList.add('hidden'); // Hide the modal
    });

    // Close modal when "Hủy" button is clicked
    cancelAddProduct.addEventListener('click', function() {
        addProductModal.classList.add('hidden'); // Hide the modal
    });

    // Close modal when clicking outside of the modal (on the overlay)
    addProductModal.addEventListener('click', function(event) {
        if (event.target === addProductModal) {
            addProductModal.classList.add('hidden');
        }
    });
});
