document.addEventListener('DOMContentLoaded', () => {

    const formModal = document.getElementById('editBrandForm');
    const editModal = document.getElementById('editModal');
    const modalTitle = document.getElementById('editModalLabel');
    const submitButton = formModal.querySelector('button[type="submit"]');

    // Handle modal for adding brand
    document.getElementById('addBrandButton').addEventListener('click', () => {
        modalTitle.textContent = 'Add Brand';
        submitButton.textContent = 'Add Brand';

        // Clear form fields
        formModal.reset();
        document.getElementById('editBrandId').value = '';

        // Set the form action for adding a brand
        formModal.action = '/admin/brands/add';
    });

    // Handle modal for editing brand
    editModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;

        // Get current brand data from button data attributes
        document.getElementById('editBrandId').value = button.getAttribute('data-id');
        document.getElementById('editBrandName').value = button.getAttribute('data-name');

        // Set the form action for updating a brand
        formModal.action = `/admin/brands/edit/${button.getAttribute('data-id')}`;
    });
});
