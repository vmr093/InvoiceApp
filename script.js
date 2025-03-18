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

    function openModal() {
        invoiceModal.style.display = "flex";
    }

    function closeModalFunc() {
        invoiceModal.style.display = "none";
    }

    newInvoiceBtn.addEventListener("click", () => {
        document.getElementById("modal-title").innerText = "New Invoice";
        document.getElementById("invoice-form").reset(); // Clear the form for a new invoice
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

    // Fetch Data from data.json
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            let invoices = data; // Store all invoices
            displayInvoices(invoices); // Initial load

            // Update invoice count
            invoiceCount.innerText = invoices.length;

            // Filter invoices when status changes
            statusFilter.addEventListener("change", () => {
                const selectedStatus = statusFilter.value;
                const filteredInvoices = selectedStatus === "all" 
                    ? invoices 
                    : invoices.filter(invoice => invoice.status === selectedStatus);

                displayInvoices(filteredInvoices);
            });
        })
        .catch(error => {
            console.error("Error fetching invoices:", error);
            invoiceList.innerHTML = "<p style='color: red;'>Failed to load invoices.</p>";
        });

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
                <button class="edit-invoice-btn" data-id="${invoice.id}">Edit</button>
            `;

            // Add event listener for Edit button
            const editButton = invoiceElement.querySelector(".edit-invoice-btn");
            editButton.addEventListener("click", () => {
                document.getElementById("modal-title").innerText = `Edit #${invoice.id}`;
                
                // Auto-fill the form fields with the existing invoice data
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

                // Load Items into the item list
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
            });

            invoiceList.appendChild(invoiceElement);
        });
    }
});
