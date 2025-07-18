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

    const formModal = document.getElementById('editOrderForm');
    const editModal = document.getElementById('editModal');

    // Handle modal for editing irder
    editModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;

        // Get current order data from button data attributes
        document.getElementById('editOrderId').value = button.getAttribute('data-id');
        document.getElementById('editOrderStatus').value = button.getAttribute('data-status');

        // Set the form action for updating a order
        formModal.action = `/admin/orders/edit/${button.getAttribute('data-id')}`;
    });
});