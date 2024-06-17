document.getElementById('calorie-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission behavior

    document.getElementById('results').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    setTimeout(calculateCalories, 2000);
});

function calculateCalories() {
    const age = document.getElementById('age').value;
    const gender = document.querySelector('input[name="customRadioInline1"]:checked').id;
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const activity = document.getElementById('list').value;
    const goal = document.getElementById('goal').value;
    const totalCalories = document.getElementById('total-calories');

    if (age === '' || weight === '' || height === '' || age < 15 || age > 80) {
        errorMessage('Please make sure the values you entered are correct');
        return;
    }

    let calories = 0;
    let BMR = gender === 'male' 
        ? 66.5 + (13.75 * parseFloat(weight)) + (5.003 * parseFloat(height)) - (6.755 * parseFloat(age))
        : 655 + (9.563 * parseFloat(weight)) + (1.850 * parseFloat(height)) - (4.676 * parseFloat(age));

    switch (activity) {
        case '1': calories = 1.2 * BMR; break;
        case '2': calories = 1.375 * BMR; break;
        case '3': calories = 1.55 * BMR; break;
        case '4': calories = 1.725 * BMR; break;
        case '5': calories = 1.9 * BMR; break;
        default: calories = BMR; // default case to handle unexpected values
    }

    // Adjust calories based on the goal
    if (goal === '2') {
        calories -= 200; // Subtract for Weight Loss and Definition
    } else if (goal === '3') {
        calories += 200; // Add for Muscle Mass
    }

    totalCalories.value = Math.round(calories);

    document.getElementById('results').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
}

function errorMessage(error) {
    document.getElementById('results').style.display = 'none';
    document.getElementById('loading').style.display = 'none';

    const errorDiv = document.createElement('div');
    const card = document.querySelector('.card');
    const heading = document.querySelector('.heading');

    errorDiv.className = 'alert alert-danger';
    errorDiv.appendChild(document.createTextNode(error));

    card.insertBefore(errorDiv, heading);

    setTimeout(clearError, 4000); // Clear the error after 4 seconds
}

function clearError() {
    const alert = document.querySelector('.alert');
    if (alert) {
        alert.remove();
    }
}
