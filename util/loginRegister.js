module.exports = (username, email, password, confirm, reg = true) => {
    let errors = [];

    if (reg) {
        if (username.length < 4) errors.push({ err: "The username should be at least 4 characters long" });
        if (password != confirm) errors.push({ err: "The repeat password should be equal to the password" });
    }
    if (email.length < 10) errors.push({ err: "The email should be at least 10 characters long" });
    if (password.length < 3) errors.push({ err: "The email should be at least 3 characters long" });
    
    return errors;
};