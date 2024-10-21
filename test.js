$(document).ready(function () {
  // Replace with your actual hosted JSON URL
  const scheduleUrl = 'https://api.npoint.io/5614154272b1609694ea'

  // Define the regular bell schedule for each period
  const bellSchedule = {
    1: { start: '8:24 AM', end: '9:31 AM' },
    2: { start: '9:36 AM', end: '10:43 AM' },
    3: { start: '10:48 AM', end: '11:55 AM' },
    4: { start: '12:41 PM', end: '1:48 PM' },
    5: { start: '1:53 PM', end: '3:00 PM' }
  }

  // Helper function to parse a time string into a Date object
  function parseTime (timeString) {
    const [time, modifier] = timeString.split(' ')
    let [hours, minutes] = time.split(':')

    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours) + 12
    } else if (modifier === 'AM' && hours === '12') {
      hours = 0
    }

    const now = new Date()
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    )
  }

  // Function to determine if the current time is within a specific period
  function isCurrentClass (startTime, endTime) {
    const currentTime = new Date()
    const start = parseTime(startTime)
    const end = parseTime(endTime)

    return currentTime >= start && currentTime <= end
  }

  // When the "Show Schedule" button is clicked
  $('#submitDay').on('click', function () {
    const selectedDay = $('#dayInput').val().toUpperCase()

    // Ensure valid input (A-G)
    if (!['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(selectedDay)) {
      alert('Please enter a valid day (A-G)')
      return
    }

    // AJAX request to load schedule data from the JSON file
    $.ajax({
      url: scheduleUrl,
      method: 'GET',
      success: function (data) {
        const schedule = data.schedule
        const daySchedule = schedule.filter(item =>
          item.days.includes(selectedDay)
        )

        // Clear previous schedule
        $('#scheduleList').empty()

        // If no classes are found for the selected day, show message
        if (daySchedule.length === 0) {
          $('#scheduleList').append(
            '<tr><td colspan="5">No classes today.</td></tr>'
          )
        } else {
          // Loop through the filtered classes and display them in the table
          daySchedule.forEach(classItem => {
            const period = classItem.period
            const time = bellSchedule[period] // Get time for the period

            if (time) {
              // Check if the current time falls within this class period
              const isCurrent = isCurrentClass(time.start, time.end)

              // If it's the current class, add the 'current-class' class to highlight it
              const rowClass = isCurrent ? 'current-class' : ''

              $('#scheduleList').append(`
                                <tr class="${rowClass}">
                                    <td>${period}</td>
                                    <td>${time.start} - ${time.end}</td>
                                    <td>${classItem.class}</td>
                                    <td>${classItem.teacher}</td>
                                    <td>${classItem.room}</td>
                                </tr>
                            `)
            }
          })
        }
      },
      // Handle errors if the AJAX request fails
      error: function () {
        alert('Error loading schedule. Please check your JSON file URL.')
      }
    })
  })
})
