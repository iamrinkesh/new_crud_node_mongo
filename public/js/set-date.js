document.addEventListener('DOMContentLoaded', function () {
    const dateTimeString = "2023-09-25T00:00:00.000Z";
    const datePart = dateTimeString.split('T')[0];
    const dateInput1 = document.getElementById('start_date');
    const dateInput2 = document.getElementById('end_date');
    dateInput1.value = datePart;
    dateInput2.value = datePart;
});






