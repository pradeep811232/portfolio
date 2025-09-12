<?php
// Define variables and set to empty values
$name = $email = $subject = $message = "";
$nameErr = $emailErr = $subjectErr = $messageErr = "";
$success = false;

// Process form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate name
    if (empty($_POST["name"])) {
        $nameErr = "Name is required";
    } else {
        $name = test_input($_POST["name"]);
        // Check if name only contains letters and whitespace
        if (!preg_match("/^[a-zA-Z ]*$/", $name)) {
            $nameErr = "Only letters and white space allowed";
        }
    }
    
    // Validate email
    if (empty($_POST["email"])) {
        $emailErr = "Email is required";
    } else {
        $email = test_input($_POST["email"]);
        // Check if email address is well-formed
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $emailErr = "Invalid email format";
        }
    }
    
    // Validate subject
    if (empty($_POST["subject"])) {
        $subjectErr = "Subject is required";
    } else {
        $subject = test_input($_POST["subject"]);
    }
    
    // Validate message
    if (empty($_POST["message"])) {
        $messageErr = "Message is required";
    } else {
        $message = test_input($_POST["message"]);
    }
    
    // If no errors, process the form
    if (empty($nameErr) && empty($emailErr) && empty($subjectErr) && empty($messageErr)) {
        // In a real application, you would send an email here
        // For demonstration purposes, we'll just set success to true
        $success = true;
        
        // You could use mail() function to send an email
        // Example: mail("your@email.com", "Contact Form: $subject", $message, "From: $email");
        
        // Clear form data after successful submission
        $name = $email = $subject = $message = "";
    }
}

// Function to sanitize form data
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form Submission</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        .container {
            max-width: 600px;
            margin: 100px auto;
            padding: 30px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
        }
        
        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .btn-container {
            text-align: center;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <?php if ($success): ?>
            <div class="success-message">
                <h1>Thank You!</h1>
                <p>Your message has been sent successfully. We'll get back to you soon.</p>
            </div>
            <div class="btn-container">
                <a href="index.html" class="btn primary-btn">Back to Homepage</a>
            </div>
        <?php else: ?>
            <h1>Oops! Something went wrong.</h1>
            <p>There was an error processing your form submission. Please try again or contact us directly.</p>
            <div class="btn-container">
                <a href="index.html" class="btn primary-btn">Back to Homepage</a>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>