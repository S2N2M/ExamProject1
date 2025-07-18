document.addEventListener('DOMContentLoaded', () => {
    const dateEle = document.querySelectorAll('.formatdate')

    dateEle.forEach(elem => {
        const oldDate = elem.textContent.trim();

        if (oldDate) {
            const date = new Date(oldDate);
            const formattedDate = date.toISOString().slice(0, 16).replace('T', ' ');
            elem.textContent = formattedDate;
        }
    })

    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (!input.value) {
                input.name = '';
            }
        });
    });

    // Clear the search
    document.getElementById('clearButton').addEventListener('click', () => {
        const searchForm = document.getElementById('searchForm');
        searchForm.reset();
        window.location.href = '/admin/products';
    });
    

    const formModal = document.getElementById('editProductForm');
    const editModal = document.getElementById('editModal');
    const modalTitle = document.getElementById('editModalLabel');
    const submitButton = formModal.querySelector('button[type="submit"]');

    // Handle modal for adding product
    document.getElementById('addProductButton').addEventListener('click', () => {
        modalTitle.textContent = 'Add Product';
        submitButton.textContent = 'Add Product';

        // Clear form fields
        formModal.reset();
        document.getElementById('editProductId').value = '';

        // Set the form action for adding a product
        formModal.action = '/admin/products/add';
    });

    // Handle modal for editing product
    editModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;

        // Get current product data from button data attributes
        document.getElementById('editProductId').value = button.getAttribute('data-id');
        document.getElementById('editProductName').value = button.getAttribute('data-name');
        document.getElementById('editProductDescription').value = button.getAttribute('data-description');
        document.getElementById('editProductPrice').value = button.getAttribute('data-price');
        document.getElementById('editProductQuantity').value = button.getAttribute('data-quantity');
        document.getElementById('editProductImgurl').value = button.getAttribute('data-imgurl');
        
        // Set the category and brand dropdowns to the current values
        document.getElementById('editProductCategory').value = button.getAttribute('data-category');
        document.getElementById('editProductBrand').value = button.getAttribute('data-brand');

        // Set the form action for updating a product
        formModal.action = `/admin/products/edit/${button.getAttribute('data-id')}`;
    });
});
