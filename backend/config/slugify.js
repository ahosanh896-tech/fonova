import slugify from "slugify";

const generateSlug = (text) => {
  if (!text || typeof text !== "string") return "";

  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

export default generateSlug;
