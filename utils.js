const buildSetString = async (fields = {}) => {
  const keys = Object.keys(fields);

  const setString = keys
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(', ');

  if (!setString.length) return;
  return setString;
};

module.exports = {
  buildSetString,
};
