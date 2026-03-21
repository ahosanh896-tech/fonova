import generateSlug from "../config/slugify.js";

const slugPlugin = (schema, options = {}) => {
  const field = options.field || "name";

  schema.pre("save", async function (next) {
    try {
      if (!this[field]) {
        return next(new Error(`${field} is required`));
      }

      if (this.isNew || this.isModified(field)) {
        const baseSlug = generateSlug(this[field]);

        const existingSlugs = await this.constructor
          .find({
            slug: new RegExp(`^${baseSlug}(-\\d+)?$`),
            _id: { $ne: this._id },
          })
          .select("slug");

        let slug = baseSlug;

        if (existingSlugs.length > 0) {
          const numbers = existingSlugs.map((doc) => {
            const match = doc.slug.match(/-(\d+)$/);
            return match ? parseInt(match[1]) : 0;
          });

          const max = Math.max(...numbers);
          slug = `${baseSlug}-${max + 1}`;
        }

        this.slug = slug;
      }

      next();
    } catch (err) {
      next(err);
    }
  });

  schema.pre("findOneAndUpdate", async function (next) {
    try {
      const update = this.getUpdate() || {};
      const name = update[field] || update.$set?.[field];

      if (!name) return next();

      const baseSlug = generateSlug(name);

      const Model = this.model;
      const currentId = this.getQuery()._id;

      const existingSlugs = await Model.find({
        slug: new RegExp(`^${baseSlug}(-\\d+)?$`),
        _id: { $ne: currentId },
      }).select("slug");

      let slug = baseSlug;

      if (existingSlugs.length > 0) {
        const numbers = existingSlugs.map((doc) => {
          const match = doc.slug.match(/-(\d+)$/);
          return match ? parseInt(match[1]) : 0;
        });

        const max = Math.max(...numbers);
        slug = `${baseSlug}-${max + 1}`;
      }

      if (update.$set) {
        update.$set.slug = slug;
      } else {
        update.slug = slug;
      }

      next();
    } catch (err) {
      next(err);
    }
  });
};

export default slugPlugin;
