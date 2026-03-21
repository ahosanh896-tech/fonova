import generateSlug from "../config/slugify.js";

const slugPlugin = (schema, options = {}) => {
  const field = options.field || "name";

  schema.pre("save", function (next) {
    if (this.isModified(field) && this[field]) {
      this.slug = generateSlug(this[field]);
    }
    next();
  });
};

export default slugPlugin;
