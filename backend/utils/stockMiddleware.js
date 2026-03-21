const stockMiddleware = (schema) => {
  schema.pre("findOneAndUpdate", async function (next) {
    try {
      this.setOptions({ runValidators: true, new: true });

      const update = this.getUpdate() || {};
      const variants = update.variants || update.$set?.variants;

      //  Only run if variants are being updated
      if (!variants) return next();

      let totalStock = 0;

      for (const v of variants) {
        if (v.stock != null && typeof v.stock !== "number") {
          return next(new Error("Variant stock must be a number"));
        }

        if (v.stock < 0) {
          return next(new Error("Variant stock cannot be negative"));
        }

        totalStock += v.stock || 0;
      }

      if (update.$set) {
        update.$set.stock = totalStock;
      } else {
        update.stock = totalStock;
      }

      next();
    } catch (err) {
      next(err);
    }
  });
};

export default stockMiddleware;
