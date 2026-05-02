import { useFieldArray, useForm } from "react-hook-form";
import { assets } from "../assets/assets";
import { useState, useEffect } from "react";
import Api from "../api/api";
import { successToast, errorToast } from "../toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const EditProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // id for PUT /api/product/:id
  const productId = searchParams.get("id");
  // slug for GET /api/product/slug/:slug
  const productSlug = searchParams.get("slug");

  const [show, setShow] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removedImages, setRemovedImages] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      category: "dining",
      subCategory: "chair",
      brand: "",
      price: "",
      discount: "",
      stock: "",
      color: "",
      material: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      tags: "",
      bestseller: false,
      featured: false,
      newArrival: false,
      images: [{ file: null }],
      variants: [],
    },
  });

  const {
    fields,
    append,
    remove: removeImageField,
  } = useFieldArray({
    control,
    name: "images",
  });

  const {
    fields: variantFields,
    append: addVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  // Fetch product data by SLUG
  useEffect(() => {
    if (!productId || !productSlug) {
      errorToast("Missing product id/slug");
      navigate("/list");
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await Api.get(`/api/product/slug/${productSlug}`);

        if (res.data.success) {
          const product = res.data.product;

          setValue("name", product.name);
          setValue("description", product.description);
          setValue("shortDescription", product.shortDescription || "");
          setValue("category", product.category);
          setValue("subCategory", product.subCategory || "");
          setValue("brand", product.brand || "");
          setValue("price", product.price);
          setValue("discount", product.discount || 0);
          setValue("stock", product.stock);
          setValue("color", product.attributes?.color || "");
          setValue("material", product.attributes?.material || "");
          setValue("weight", product.attributes?.weight || "");
          setValue("length", product.attributes?.dimensions?.length || "");
          setValue("width", product.attributes?.dimensions?.width || "");
          setValue("height", product.attributes?.dimensions?.height || "");
          setValue("bestseller", product.bestseller);
          setValue("featured", product.featured);
          setValue("newArrival", product.newArrival);

          if (product.tags && product.tags.length > 0) {
            setValue("tags", product.tags.join(", "));
          }

          setExistingImages(product.images || []);

          // Variants
          if (product.variants && product.variants.length > 0) {
            // prevent duplicates if effect runs again
            product.variants.forEach((variant) => {
              addVariant({
                name: variant.name || "",
                price: variant.price || "",
                stock: variant.stock || "",
                color: variant.color || "",
              });
            });
            setShow(true);
          }
        } else {
          errorToast(res.data.message);
          navigate("/list");
        }
      } catch (error) {
        console.error(error);
        errorToast(error.response?.data?.message || "Failed to fetch product");
        navigate("/list");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, productSlug, navigate, setValue, addVariant]);

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];

    if (file) {
      const updated = [...imagesPreview];
      updated[index] = file;
      setImagesPreview(updated);

      if (index === fields.length - 1 && fields.length < 4) {
        append({ file: null });
      }
    }
  };

  const handleDragOver = (index, e) => {
    e.preventDefault();
    setDragIndex(index);
  };

  const handleDragLeave = () => {
    setDragIndex(null);
  };

  const handleDrop = (index, e) => {
    e.preventDefault();
    setDragIndex(null);

    const file = e.dataTransfer.files[0];

    if (!file || !file.type.startsWith("image/")) {
      errorToast("Only images allowed");
      return;
    }

    if (file) {
      const uploaded = [...imagesPreview];
      uploaded[index] = file;
      setImagesPreview(uploaded);

      if (index === fields.length - 1 && fields.length < 4) {
        append({ file: null });
      }
    }
  };

  const handleRemoveExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setRemovedImages((prev) => [...prev, imageToRemove.public_id]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    const updated = [...imagesPreview];
    updated.splice(index, 1);
    setImagesPreview(updated);
    removeImageField(index);
    setDragIndex(null);
  };

  const onSubmit = async (data) => {
    try {
      if (!productId) {
        errorToast("Missing product id");
        return;
      }

      const formData = new FormData();

      // Basic fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("shortDescription", data.shortDescription);
      formData.append("category", data.category);
      formData.append("subCategory", data.subCategory);
      formData.append("brand", data.brand);
      formData.append("price", data.price);
      formData.append("discount", data.discount || 0);
      formData.append("stock", data.stock);

      // Flags
      formData.append("bestseller", data.bestseller || false);
      formData.append("featured", data.featured || false);
      formData.append("newArrival", data.newArrival || false);

      // New images
      imagesPreview.forEach((file) => {
        if (file) formData.append("images", file);
      });

      // Removed images
      if (removedImages.length > 0) {
        formData.append("removeImages", JSON.stringify(removedImages));
      }

      // Attributes
      const attributes = {
        color: data.color,
        material: data.material,
        weight: data.weight,
        dimensions: {
          length: data.length,
          width: data.width,
          height: data.height,
        },
      };
      formData.append("attributes", JSON.stringify(attributes));

      // Variants
      formData.append("variants", JSON.stringify(data.variants || []));

      // Tags
      const tagsArray = data.tags
        ? data.tags.split(",").map((tag) => tag.trim())
        : [];
      formData.append("tags", JSON.stringify(tagsArray));

      // PUT uses _id
      const res = await Api.put(`/api/product/${productId}`, formData);

      if (res.data.success) {
        successToast(res.data.message);
        navigate("/list");
      } else {
        errorToast(res.data.message);
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading product data...</p>
      </div>
    );
  }

  return (
    <form
      className="w-full min-h-screen flex mb-50 mt-10 justify-center px-4 lg:px-12"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col w-full md:flex-row gap-12 xl:gap-50 text-sm">
        {/* IMAGE UPLOAD */}
        <div className="w-full sm:w-2/3 max-w-md">
          <h2 className="font-bold text-gray-700 text-base mb-4">
            Product Images
          </h2>

          {/* Existing Images */}
          {existingImages.map((img, index) => (
            <div
              key={`existing-${index}`}
              className="relative mb-4 w-full flex items-center justify-center"
            >
              <img
                src={img.url}
                alt={`Existing ${index + 1}`}
                className="w-40 h-40 object-cover rounded block mx-auto object-center"
              />

              <button
                type="button"
                onClick={() => handleRemoveExistingImage(index)}
                className="absolute top-[-10px] right-[-10px] bg-red-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}

          {/* New Image Upload Slots */}
          {fields.map((field, index) => (
            <label
              key={field.id}
              onDragLeave={handleDragLeave}
              onDragOver={(e) => {
                if (!imagesPreview[index]) handleDragOver(index, e);
              }}
              onDrop={(e) => {
                if (!imagesPreview[index]) handleDrop(index, e);
              }}
              className={`w-full py-2 px-4 flex flex-col items-center justify-center text-center cursor-pointer mb-4 lg:py-7 ${
                imagesPreview[index]
                  ? ""
                  : "border border-gray-600 rounded border-dashed"
              }`}
            >
              {dragIndex === index && !imagesPreview[index] ? (
                <div className="text-blue-500 font-semibold">
                  <img
                    src={assets.upload_image}
                    className="w-16 h-16 mb-2"
                    alt=""
                  />
                  <p>Drop image here</p>
                </div>
              ) : imagesPreview[index] ? (
                <div className="relative w-full h-40 flex items-center justify-center">
                  <img
                    src={URL.createObjectURL(imagesPreview[index])}
                    alt=""
                    className="w-40 h-40 object-cover mb-2 rounded block mx-auto object-center"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveNewImage(index);
                    }}
                    className="absolute top-[-10px] right-[-10px] bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <img
                    src={assets.upload_image}
                    className="w-16 h-16 mb-2"
                    alt=""
                  />
                  <p>
                    Drag & drop or browse <br className="lg:hidden" /> JPEG,
                    PNG, WEBP
                  </p>
                </>
              )}

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  handleImageChange(index, e);
                }}
              />
            </label>
          ))}
        </div>

        <div className="w-full sm:w-3/4 flex flex-col gap-4">
          {/* Basic Information */}
          <div className="w-full">
            <h2 className="font-bold text-gray-700 text-base">
              Basic Information
            </h2>

            <input
              className={`border w-full max-w-md p-1 outline-none border-gray-300 rounded px-4 ${
                errors.name ? "border-red-500" : ""
              }`}
              placeholder="Name *"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <textarea
            className={`border w-full max-w-md p-2 outline-none border-gray-300 rounded px-4 min-h-[100px] resize-none ${
              errors.description ? "border-red-500" : ""
            }`}
            placeholder="Description *"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}

          <textarea
            className="border w-full max-w-md p-2 outline-none border-gray-300 rounded px-4 min-h-[50px] resize-none"
            placeholder="Short Description"
            {...register("shortDescription")}
          />

          {/* Category, SubCategory, Brand */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 w-full sm:gap-8 justify-between items-center max-w-md">
            <div>
              <h2 className="text-gray-700">Category *</h2>
              <select
                className="border border-gray-300 rounded p-2 w-30"
                {...register("category", { required: "Category is required" })}
              >
                <option value="dining">Dining</option>
                <option value="living">Living</option>
                <option value="bedroom">Bedroom</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <h2 className="text-gray-700">Sub category</h2>
              <select
                className="border border-gray-300 rounded p-2 w-30"
                {...register("subCategory")}
              >
                <option value="chair">Chair</option>
                <option value="table">Table</option>
                <option value="sofa">Sofa</option>
                <option value="bed">Bed</option>
              </select>
            </div>

            <div>
              <h2 className="text-gray-700">Brand</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none"
                placeholder="Brand"
                {...register("brand")}
              />
            </div>

            {/* Price, Discount, Stock */}
            <div>
              <h2>Price *</h2>
              <input
                className={`border border-gray-300 rounded p-2 w-30 outline-none ${
                  errors.price ? "border-red-500" : ""
                }`}
                type="number"
                placeholder="Price"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 1, message: "Price must be greater than 0" },
                })}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <h2>Discount %</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none"
                type="number"
                placeholder="Discount %"
                {...register("discount")}
              />
            </div>

            <div>
              <h2>Stock *</h2>
              <input
                className={`border border-gray-300 rounded p-2 w-30 outline-none ${
                  errors.stock ? "border-red-500" : ""
                }`}
                type="number"
                placeholder="Stock"
                {...register("stock", {
                  required: "Stock is required",
                  min: { value: 0, message: "Stock can't be negative" },
                })}
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* Attributes section */}
          <h1 className="font-bold underline">Attributes</h1>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 w-full sm:gap-8 justify-between items-center max-w-md">
            <div>
              <h2 className="text-gray-700">Color</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none"
                placeholder="Color"
                {...register("color")}
              />
            </div>

            <div>
              <h2>Material</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none"
                type="text"
                placeholder="Material"
                {...register("material")}
              />
            </div>

            <div>
              <h2>Weight</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none"
                type="number"
                placeholder="Weight"
                {...register("weight")}
              />
            </div>

            <div>
              <h2>Length</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none"
                type="number"
                placeholder="Length"
                {...register("length")}
              />
            </div>

            <div>
              <h2>Width</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none"
                type="number"
                placeholder="Width"
                {...register("width")}
              />
            </div>

            <div>
              <h2>Height</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none"
                type="number"
                placeholder="Height"
                {...register("height")}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <h2>Tags</h2>
            <input
              className="border border-gray-300 rounded max-w-md p-2 w-full outline-none"
              placeholder="Comma separated tags"
              {...register("tags")}
            />
          </div>

          {/* Flags */}
          <h2>Flags</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full sm:gap-8 justify-between items-center max-w-md">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("bestseller")} />
              Bestseller
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("featured")} />
              Featured
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("newArrival")} />
              New Arrival
            </label>
          </div>

          {/* Variants Toggle */}
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="border px-3 py-1 mb-3 w-50 hover:bg-gray-100 transition rounded"
          >
            {show ? "Hide Variants" : "Add Variants"}
          </button>

          {/* Variants Grid */}
          {show && (
            <>
              {variantFields.map((item, i) => (
                <div
                  key={item.id}
                  className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 border p-3 rounded max-w-md"
                >
                  <div>
                    <h2>Name</h2>
                    <input
                      className="border border-gray-300 rounded p-2 w-full outline-none"
                      placeholder="Name"
                      {...register(`variants.${i}.name`)}
                    />
                  </div>

                  <div>
                    <h2>Price</h2>
                    <input
                      type="number"
                      className="border border-gray-300 rounded p-2 w-full outline-none"
                      placeholder="Price"
                      {...register(`variants.${i}.price`)}
                    />
                  </div>

                  <div>
                    <h2>Stock</h2>
                    <input
                      type="number"
                      className="border border-gray-300 rounded p-2 w-full outline-none"
                      placeholder="Stock"
                      {...register(`variants.${i}.stock`)}
                    />
                  </div>

                  <div>
                    <h2>Color</h2>
                    <input
                      className="border border-gray-300 rounded p-2 w-full outline-none"
                      placeholder="Color"
                      {...register(`variants.${i}.color`)}
                    />
                  </div>

                  <div className="flex items-end ml-8 pb-2">
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <img
                        className="w-5 h-5"
                        src={assets.remove}
                        alt="Remove"
                      />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  addVariant({ name: "", price: "", stock: "", color: "" })
                }
                className="mt-2 border px-3 py-1 max-w-md hover:bg-gray-100 transition"
              >
                + Add Variant
              </button>
            </>
          )}

          <br />

          {/* Submit and Cancel Buttons */}
          <div className="flex gap-4 max-w-md">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center justify-between w-full max-w-md py-2 px-4 rounded text-white ${
                isSubmitting ? "bg-gray-400" : "bg-black hover:bg-gray-800"
              }`}
            >
              {isSubmitting ? "UPDATING PRODUCT..." : "UPDATE PRODUCT"}
              <img
                src={assets.white_arrow}
                alt="Arrow"
                className="w-4 h-4 mr-2"
              />
            </button>

            <button
              type="button"
              onClick={() => navigate("/list")}
              className="w-full max-w-md py-2 px-4 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProduct;
