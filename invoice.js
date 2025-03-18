document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const invoiceId = params.get("id");

    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            const invoice = data.find(inv => inv.id === invoiceId);

            if (invoice) {
                document.getElementById("invoice-id").innerText = invoice.id;
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

                // Load Items
                const itemList = document.getElementById("item-list");
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
            }
        })
        .catch(error => console.error("Error loading invoice:", error));
});
