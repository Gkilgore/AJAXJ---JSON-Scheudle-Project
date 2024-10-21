$(document).ready(function () {
    // Replace the URL with the actual hosted JSON file from JSONKeeper, JSONBin, or nPoint.io
    const scheduleUrl = 'https://api.npoint.io/5614154272b1609694ea'

    // When the "Show Schedule" button is clicked
    $('#submitDay').on('click', function () {
        // Get the input value from the text field (user enters a day)
        const selectedDay = $('#dayInput').val().toUpperCase()

        // Ensure that the user input is valid (must be A-G)
        if (!['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(selectedDay)) {
            alert('Please enter a valid day (A-G)')
            return
        }

        // Make an AJAX request to load the schedule from the hosted JSON file
        $.ajax({
            url: scheduleUrl, // The URL of the hosted JSON file
            method: 'GET', // HTTP method to get data
            success: function (data) {
                // Filter the schedule data to find the classes for the selected day
                const schedule = data.schedule
                const daySchedule = schedule.filter(item =>
                    item.days.includes(selectedDay)
                )

                // Clear the previous schedule if there is any
                $('#scheduleList').empty()

                // If no classes meet on the selected day, show a message
                if (daySchedule.length === 0) {
                    $('#scheduleList').append(
                        '<li class="list-group-item">No classes today.</li>'
                    )
                } else {
                    // Loop through the filtered classes for the selected day and display them
                    daySchedule.forEach(classItem => {
                        $('#scheduleList').append(
                            `<li class="list-group-item">
                                <strong>Period ${classItem.period}:</strong> ${classItem.class} with ${classItem.teacher} in Room ${classItem.room}
                            </li>`
                        )
                    })
                }
            },
            // If there is an error during the AJAX request (e.g., wrong URL), show an error message
            error: function () {
                alert('Error loading schedule. Please check your JSON file URL.')
            }
        })
    })
})
