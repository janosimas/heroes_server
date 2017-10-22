// function to remove the atributes used internally by the DB
const clearDbAtributes = (elements) => {
  if (elements instanceof Array) {
    elements.forEach((element) => {
      // recursive call
      clearDbAtributes(element);
    });
  } else {
    delete element._id;
    delete element.__v;
  }
};

module.exports = clearDbAtributes;
