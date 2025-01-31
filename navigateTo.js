function navigateTo(url, waitForSeconds = false, delayTime = 25) {

    if (waitForSeconds) {        
        // Wait for the specified number of seconds before redirecting
        setTimeout(function() {
            window.location.href = url;
        }, delayTime * 1000);  // Convert seconds to milliseconds
    } else {
        // Redirect immediately
        window.location.href = url;
    }
}
