// Function to create and add buttons to rows
function addButtonsToRows() {
  console.log('addButtonsToRows');
  // Select all rows - modify this selector according to your target page structure
  const rows = document.querySelectorAll('.message > .content > div:nth-of-type(2)'); // selects the second div within .message .content
  console.log(rows);
  rows.forEach((row) => {
    const button = document.createElement('button');
    button.className = 'row-action-button';
    button.textContent = 'Show Details';
    
    // Create button container
    const buttonCell = document.createElement('div'); // Create a container for the button
    buttonCell.style.display = 'inline-block'; // Optional: style the button container
    buttonCell.appendChild(button); // Append the button to the button container
    row.appendChild(buttonCell);
    
    // Add click event listener
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      showPopup(row);
    });
  });
}

// Function to create and show popup
function showPopup(row) {
  // Remove any existing popup
  const existingPopup = document.querySelector('.custom-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  // Create popup
  const popup = document.createElement('div');
  popup.className = 'custom-popup';
  
  // Get content from row - modify this according to your needs
  const content = row.textContent;
  
  // Add content to popup
  popup.innerHTML = `
    <div class="popup-header">
      <h3>Details</h3>
      <button class="close-button">&times;</button>
    </div>
    <div class="popup-content">
      ${content}
    </div>
  `;
  
  // Add close button functionality
  popup.querySelector('.close-button').addEventListener('click', () => {
    popup.remove();
  });
  
  // Add popup to page
  document.body.appendChild(popup);
}

// Run when page loads
document.addEventListener('DOMContentLoaded', addButtonsToRows); 
addButtonsToRows();