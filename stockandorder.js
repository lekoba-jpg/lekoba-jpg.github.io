const medications = {
  "Paracetamol 500mg": 10,
  "Ibuprofen 200mg": 3,
  "Insulin - Novorapid": 15,
  "Amoxicillin 250mg": 6,
  "Ventolin Inhaler": 2
};

const select = document.getElementById('medicine');
const status = document.getElementById('stockStatus');

// Populate dropdown
if (select) {
  for (let name in medications) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  }

  select.addEventListener('change', updateStockStatus);
  updateStockStatus();
}

function updateStockStatus() {
  const med = select.value;
  const stock = medications[med];
  if (stock <= 5) {
    status.textContent = `Low Stock: Only ${stock} left!`;
    status.className = 'stock-message low-stock';
  } else {
    status.textContent = `In Stock: ${stock} available`;
    status.className = 'stock-message in-stock';
  }
}

function placeOrder() {
  const med = select.value;
  if (medications[med] > 0) {
    medications[med]--;
    alert(`Order placed for ${med}`);
    updateStockStatus();
  } else {
    alert(`${med} is out of stock.`);
  }
}
