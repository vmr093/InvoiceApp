document.addEventListener("DOMContentLoaded", () => {
    const invoiceList = document.querySelector(".invoice-list");
    const invoiceCount = document.getElementById("invoice-count");
    const emptyMessage = document.getElementById("empty-message");
    const statusFilter = document.getElementById("status-filter");

    // Modal elements
    const invoiceModal = document.getElementById("invoice-modal");
    const closeModal = document.querySelector(".close-btn");
    const newInvoiceBtn = document.querySelector(".new-invoice-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const invoiceForm = document.getElementById("invoice-form");

    function openModal() {
        invoiceModal.style.display = "flex";
    }

    function closeModalFunc() {
        invoiceModal.style.display = "none";
    }

    newInvoiceBtn.addEventListener("click", () => {
        document.getElementById("modal-title").innerText = "New Invoice";
        invoiceForm.reset(); // Clear the form for a new invoice
        openModal();
    });

    closeModal.addEventListener("click", closeModalFunc);
    cancelBtn.addEventListener("click", closeModalFunc);

    // Close when clicking outside modal
    window.addEventListener("click", (event) => {
        if (event.target === invoiceModal) {
            closeModalFunc();
        }
    });

    // Load Invoices: Fetch from localStorage or data.json
    let invoices = [];

    if (localStorage.getItem("invoices")) {
        invoices = JSON.parse(localStorage.getItem("invoices"));
        displayInvoices(invoices);
    } else {
        fetch("data.json")
            .then(response => response.json())
            .then(data => {
                invoices = data;
                localStorage.setItem("invoices", JSON.stringify(invoices)); // Store in localStorage
                displayInvoices(invoices);
                invoiceCount.innerText = invoices.length;
            })
            .catch(error => {
                console.error("Error fetching invoices:", error);
                invoiceList.innerHTML = "<p style='color: red;'>Failed to load invoices.</p>";
            });
    }

    // Function to Delete an Invoice
    function deleteInvoice(invoiceId) {
        if (confirm("Are you sure you want to delete this invoice?")) {
            invoices = invoices.filter(invoice => invoice.id !== invoiceId);

            // Update localStorage
            localStorage.setItem("invoices", JSON.stringify(invoices));

            // Update UI
            displayInvoices(invoices);
            invoiceCount.innerText = invoices.length;

            alert("Invoice deleted successfully!");
        }
    }

    // Function to Populate Edit Modal with Invoice Data
    function populateEditModal(invoice) {
        document.getElementById("modal-title").innerText = `Edit #${invoice.id}`;

        // Populate fields with invoice data
        document.getElementById("sender-address").value = invoice.senderAddress.street;
        document.getElementById("sender-city").value = invoice.senderAddress.city;
        document.getElementById("sender-postcode").value = invoice.senderAddress.postCode;
        document.getElementById("sender-country").value = invoice.senderAddress.country;

        document.getElementById("client-name").value = invoice.clientName;
        document.getElementById("client-email").value = invoice.clientEmail;
        document.getElementById("client-address").value = invoice.clientAddress.street;
        document.getElementById("client-city").value = invoice.clientAddress.city;
        document.getElementById("client-postcode").value = invoice.clientAddress.postCode;
        document.getElementById("client-country").value = invoice.clientAddress.country;

        document.getElementById("invoice-date").value = invoice.createdAt;
        document.getElementById("payment-terms").value = invoice.paymentTerms;
        document.getElementById("project-description").value = invoice.description;

        // Populate item list
        const itemList = document.getElementById("item-list");
        itemList.innerHTML = ""; // Clear previous items

        invoice.items.forEach(item => {
            const itemRow = document.createElement("div");
            itemRow.classList.add("item-row");
            itemRow.innerHTML = `
                <input type="text" value="${item.name}" />
                <input type="number" value="${item.quantity}" />
                <input type="number" value="${item.price}" />
                <input type="number" value="${item.total}" disabled />
            `;
            itemList.appendChild(itemRow);
        });

        openModal();
    }

    // Function to Display Invoices
    function displayInvoices(invoices) {
        invoiceList.innerHTML = ""; // Clear list
    
        if (invoices.length === 0) {
            emptyMessage.style.display = "block";
        } else {
            emptyMessage.style.display = "none";
        }
    
        invoices.forEach(invoice => {
            const invoiceElement = document.createElement("div");
            invoiceElement.classList.add("invoice");
    
            // Set status class
            let statusClass = "";
            if (invoice.status === "paid") statusClass = "status-paid";
            else if (invoice.status === "pending") statusClass = "status-pending";
            else statusClass = "status-draft";
    
            invoiceElement.innerHTML = `
                <div class="invoice-info">
                    <p><strong>#${invoice.id}</strong></p>
                    <p>Due ${invoice.paymentDue}</p>
                    <p>${invoice.clientName}</p>
                </div>
                <p class="invoice-amount">£${invoice.total.toFixed(2)}</p>
                <span class="status ${statusClass}">${invoice.status}</span>
                <div class="invoice-actions">
                    <button class="view-invoice-btn" data-id="${invoice.id}">View</button>
                    <button class="edit-invoice-btn" data-id="${invoice.id}">Edit</button>
                    <button class="delete-invoice-btn" data-id="${invoice.id}">Delete</button>
                </div>
            `;

            // Add event listener for View button
            invoiceElement.querySelector(".view-invoice-btn").addEventListener("click", () => {
                window.location.href = `invoice.html?id=${invoice.id}`;
            });

            // Add event listener for Edit button
            invoiceElement.querySelector(".edit-invoice-btn").addEventListener("click", () => {
                populateEditModal(invoice);
            });

            // Add event listener for Delete button
            invoiceElement.querySelector(".delete-invoice-btn").addEventListener("click", () => {
                deleteInvoice(invoice.id);
            });

            invoiceList.appendChild(invoiceElement);
        });
    }

    // Filter invoices when status changes
    statusFilter.addEventListener("change", () => {
        const selectedStatus = statusFilter.value;
        const filteredInvoices = selectedStatus === "all" 
            ? invoices 
            : invoices.filter(invoice => invoice.status === selectedStatus);

        displayInvoices(filteredInvoices);
    });
});
