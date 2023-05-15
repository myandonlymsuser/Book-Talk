module.exports = (title, author, genre, stars, image, review) => {
    let errors = [];

    if (title.length < 2) errors.push({ err: "The Title should be at least 2 characters" });
    if (author.length < 5) errors.push({ err: "The Author should be at least 5 characters" });
    if (genre.length < 3) errors.push({ err: "The Genre should be at least 3 characters" });
    if (stars < 1 || stars > 5) errors.push({ err: "The Stars should be a positive number between 1 and 5" });
    if(!image.startsWith('http://') && !image.startsWith('https://')) errors.push({ err: "The Image should start with http:// or https://." });
    if (review.length < 10) errors.push({ err: "The Review should be a minimum of 10 characters long." });

    return errors;
};