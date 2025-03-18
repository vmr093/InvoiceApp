document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const invoiceId = params.get("id");

    if (!invoiceId) {
        console.error("No invoice ID found in URL.");
        return;
    }

    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            const invoice = data.find(inv => inv.id === invoiceId);

            if (!invoice) {
                console.error("Invoice not found.");
                return;
            }

            // Populate Invoice Details
            document.getElementById("invoice-id").innerText = `#${invoice.id}`;
            document.getElementById("invoice-status").innerText = invoice.status;
            document.getElementById("invoice-status").classList.add(`status-${invoice.status}`);

            document.getElementById("sender-address").innerText = invoice.senderAddress.street;
            document.getElementById("sender-city").innerText = invoice.senderAddress.city;
            document.getElementById("sender-postcode").innerText = invoice.senderAddress.postCode;
            document.getElementById("sender-country").innerText = invoice.senderAddress.country;

            document.getElementById("client-name").innerText = invoice.clientName;
            document.getElementById("client-email").innerText = invoice.clientEmail;
            document.getElementById("client-address").innerText = invoice.clientAddress.street;
            document.getElementById("client-city").innerText = invoice.clientAddress.city;
            document.getElementById("client-postcode").innerText = invoice.clientAddress.postCode;
            document.getElementById("client-country").innerText = invoice.clientAddress.country;

            document.getElementById("invoice-date").innerText = invoice.createdAt;
            document.getElementById("payment-due").innerText = invoice.paymentDue;
            document.getElementById("project-description").innerText = invoice.description;

            const itemList = document.getElementById("item-list");
            invoice.items.forEach(item => {
                itemList.innerHTML += `<tr><td>${item.name}</td><td>${item.quantity}</td><td>£${item.price.toFixed(2)}</td><td>£${item.total.toFixed(2)}</td></tr>`;
            });

            document.getElementById("amount-due").innerText = `£${invoice.total.toFixed(2)}`;
        })
        .catch(error => console.error("Error loading invoice:", error));
});
