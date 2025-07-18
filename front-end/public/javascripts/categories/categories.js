document.addEventListener('DOMContentLoaded', () => {

    const formModal = document.getElementById('editCategoryForm');
    const editModal = document.getElementById('editModal');
    const modalTitle = document.getElementById('editModalLabel');
    const submitButton = formModal.querySelector('button[type="submit"]');

    // Handle modal for adding category
    document.getElementById('addCategoryButton').addEventListener('click', () => {
        modalTitle.textContent = 'Add Category';
        submitButton.textContent = 'Add Category';

        // Clear form fields
        formModal.reset();
        document.getElementById('editCategoryId').value = '';

        // Set the form action for adding a category
        formModal.action = '/admin/categories/add';
    });

    // Handle modal for editing category
    editModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;

        // Get current category data from button data attributes
        document.getElementById('editCategoryId').value = button.getAttribute('data-id');
        document.getElementById('editCategoryName').value = button.getAttribute('data-name');

        // Set the form action for updating a category
        formModal.action = `/admin/categories/edit/${button.getAttribute('data-id')}`;
    });
});
