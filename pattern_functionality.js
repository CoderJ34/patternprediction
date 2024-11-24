var current_entries = [];
current_prediction_state = 0
function predictPatternButton() {
    // Encode the entries array and send it in the fetch request
    let encoded_entries = encodeURIComponent(JSON.stringify(current_entries));

    fetch(`https://coderj.pythonanywhere.com/generate_pattern_predictions?pattern=${encoded_entries}`)
        .then(response => {
            if (response.status === 400) {
                console.error("Bad request, not enough data.");
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                console.log("Predicted numbers:", data);
                current_entries = eval(data["analysis"].replace(/\n/g, ""));
                console.log(current_entries)
                current_prediction_state = 1
                displayCurrentEntries(current_entries);
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function addEntryButton() {
    if (current_prediction_state == 1) {
        current_entries = []
    }
    current_prediction_state = 0
    // Get the input value and push it to the current_entries array
    let pattern_input = document.getElementById("patternInput");
    current_entries.push(pattern_input.value);
    pattern_input.value = "";  
    displayCurrentEntries();
}

function displayCurrentEntries() {
    // Display the current entries, joined by commas
    let current_entries_element = document.getElementById("current_entries");
    current_entries_element.value = "Current Entries: " + current_entries.join(", ");
}

function manage_button_clicks() {
    let all_elements = document.getElementsByTagName("*");
    for (let i = 0; i < all_elements.length; i++) {
        let cur_element = all_elements[i];
        if (cur_element.tagName === "BUTTON") {
            cur_element.addEventListener("click", function (event) {
                eval(event.target.id)();  // Call the function from the button's id
            });
        }
    }
}

window.onload = function () {
    manage_button_clicks();
    setInterval(displayCurrentEntries, 1);  // Update the display every 500ms
};
