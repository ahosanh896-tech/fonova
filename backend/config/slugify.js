const generateSlug = (text) => {
  if (!text || typeof text !== "string") return "";

  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};
