document.addEventListener("DOMContentLoaded", () => {
    const invoiceList = document.querySelector(".invoice-list");
    const invoiceCount = document.getElementById("invoice-count");
    const emptyMessage = document.getElementById("empty-message");
    const statusFilter = document.getElementById("status-filter");

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
                <p><strong>#${invoice.id}</strong></p>
                <p>Due ${invoice.paymentDue}</p>
                <p>${invoice.clientName}</p>
                <p><strong>£${invoice.total.toFixed(2)}</strong></p>
                <span class="status ${statusClass}">${invoice.status}</span>
            `;

            // Make invoice clickable
            invoiceElement.addEventListener("click", () => {
                window.location.href = `invoice.html?id=${invoice.id}`;
            });

            invoiceList.appendChild(invoiceElement);
        });
    }
});
