document.addEventListener('DOMContentLoaded', () => {
    const formModal = document.getElementById('editUserForm');
    const editModal = document.getElementById('editModal');

    // Handle modal for editing user
    editModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;

        // Get current user data from button data attributes
        document.getElementById('editUserId').value = button.getAttribute('data-id');
        document.getElementById('editUserFirstname').value = button.getAttribute('data-firstname');
        document.getElementById('editUserLastname').value = button.getAttribute('data-lastname');
        document.getElementById('editUserUsername').value = button.getAttribute('data-username');
        document.getElementById('editUserEmail').value = button.getAttribute('data-email');
        
        // Set the membership and role dropdowns to the current values
        document.getElementById('editUserMembership').value = button.getAttribute('data-membership');
        document.getElementById('editUserRole').value = button.getAttribute('data-role');

        // Set the form action for updating a user
        formModal.action = `/admin/users/edit/${button.getAttribute('data-id')}`;
    });
});