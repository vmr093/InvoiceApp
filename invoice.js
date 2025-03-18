document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const invoiceId = params.get("id");

    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            const invoice = data.find(inv => inv.id === invoiceId);

            if (invoice) {
                document.getElementById("invoice-id").innerText = invoice.id;
                document.getElementById("description").innerText = invoice.description;
                document.getElementById("status").innerText = invoice.status;
                document.getElementById("status").classList.add(`status-${invoice.status}`);
                document.getElementById("client-name").innerText = invoice.clientName;
                document.getElementById("client-email").innerText = invoice.clientEmail;
                document.getElementById("invoice-date").innerText = invoice.createdAt;
                document.getElementById("payment-due").innerText = invoice.paymentDue;
                document.getElementById("client-address").innerText = `${invoice.clientAddress.street}, ${invoice.clientAddress.city}`;

                document.getElementById("total").innerText = invoice.total.toFixed(2);

                const itemsList = document.getElementById("items-list");
                invoice.items.forEach(item => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>$${item.total.toFixed(2)}</td>
                    `;
                    itemsList.appendChild(row);
                });
            }
        })
        .catch(error => console.error("Error fetching invoice:", error));
});
