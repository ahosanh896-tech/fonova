import { useFieldArray, useForm } from "react-hook-form";
import { assets } from "../assets/assets";
import { useState } from "react";
import Api from "../api/api";
import { successToast, errorToast } from "../toast";

const Add = () => {
  const [show, setShow] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
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
      tags: "",
      bestseller: false,
      featured: false,
      newArrival: false,
      images: [{ file: null }],
      variants: [],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "images",
  });

  const {
    fields: variantFields,
    append: addVariant,
    remove: remove,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];

    //if upload then show preview
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

  const handleRemoveImage = (index) => {
    const updated = [...imagesPreview];
    updated.splice(index, 1);
    setImagesPreview(updated);

    // remove from react-hook-form field array
    remove(index);
    setDragIndex(null);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      //Basic fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("shortDescription", data.shortDescription);
      formData.append("category", data.category);
      formData.append("subCategory", data.subCategory);
      formData.append("brand", data.brand);
      formData.append("price", data.price);
      formData.append("discount", data.discount);
      formData.append("stock", data.stock);

      //Flage
      formData.append("bestseller", data.bestseller || false);
      formData.append("featured", data.featured || false);
      formData.append("newArrival", data.newArrival || false);

      //Images
      imagesPreview.forEach((file) => {
        if (file) {
          formData.append("images", file);
        }
      });

      //Attributes
      const attributes = {
        color: data.color,
        material: data.material,
        weight: data.weight,
        length: data.length,
        width: data.width,
        height: data.height,
      };

      formData.append("attributes", JSON.stringify(attributes));

      //Variants
      formData.append("variants", JSON.stringify(data.variants || []));

      //tags
      const tagsArray = data.tags
        ? data.tags.split(",").map((tag) => tag.trim())
        : [];

      formData.append("tags", JSON.stringify(tagsArray));

      //api call
      const res = await Api.post("/api/product/add", formData);

      if (res.data.success) {
        successToast(res.data.message);
        reset();
        setImagesPreview([]);
      } else {
        errorToast(res.data.message);
      }
    } catch (error) {
      console.log(error);
      errorToast(error.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <form
      className="w-full h-screen flex mb-50 mt-10 justify-center px-4 lg:px-12   "
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col w-full  md:flex-row gap-12 xl:gap-50 text-sm">
        {/* IMAGE UPLOAD */}
        <div className="w-full sm:w-2/3 max-w-md ">
          <h2>Product Images</h2>

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
              className={`block w-full   py-2 px-4 flex flex-col items-center justify-center text-center cursor-pointer mb-4 lg:py-7 ${imagesPreview[index] ? "" : " border border-gray-600 border-1 rounded border-dashed"}`}
            >
              {dragIndex === index && !imagesPreview[index] ? (
                <div className="text-blue-500 font-semibold ">
                  <img
                    src={assets.upload_image}
                    className="w-16 h-16 mb-2"
                    alt=""
                  />
                  <p>Drop image here</p>
                </div>
              ) : imagesPreview[index] ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(imagesPreview[index])}
                    alt=""
                    className="w-40 h-40 object-cover mb-2"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="absolute top-[-30px] right-[-40px] text-white rounded-full px-2 py-1 text-xs"
                  >
                    <img className="w-2 h-2" src={assets.remove1} alt="" />
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

        <div className="w-full sm:w-3/4 flex flex-col gap-4 ">
          {/* Basic Information */}
          <div className="w-full ">
            <h2 className="font-bold text-gray-700 text-base">
              Basic Information
            </h2>

            <input
              className="border border-1 w-full max-w-md p-1 outline-none border-gray-300 rounded px-4"
              placeholder="Name"
              {...register("name", { required: "Name is required" })}
            />
          </div>
          <textarea
            className="border w-full max-w-md p-2 outline-none border-gray-300 rounded px-4 min-h-[100px]  resize-none"
            placeholder="Description"
            {...register("description", {
              required: "Description is required",
            })}
          />
          <textarea
            className="border w-full max-w-md p-2 outline-none border-gray-300 rounded px-4 min-h-[50px]  resize-none"
            placeholder="shortDescription"
            {...register("shortDescription", {
              required: "shortDescription is required",
            })}
          />
          {/* -------------- */}
          {/* CATEGORY */}
          <div className="grid grid-cols-2 lg:grid-cols-3  gap-2  w-full sm:gap-8 justify-between items-center max-w-md">
            <div>
              <h2 className=" text-gray-700 ">Category</h2>
              <select
                className="border border-gray-300 rounded p-2 w-30"
                {...register("category", { required: "Category is required" })}
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="dining">Dining</option>
                <option value="living">Living</option>
                <option value="bedroom">Bedroom</option>
              </select>
            </div>
            <div>
              <h2 className=" text-gray-700 ">Sub category</h2>
              <select
                className="border border-gray-300 rounded p-2 w-30"
                {...register("subCategory")}
              >
                <option value="" disabled>
                  Select sub category
                </option>
                <option value="chair">Chair</option>
                <option value="table">Table</option>
                <option value="sofa">Sofa</option>
                <option value="bed">Bed</option>
              </select>{" "}
            </div>
            <div>
              <h2 className=" text-gray-700 ">Brand</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none"
                placeholder="Brand"
                {...register("brand")}
              />
            </div>

            {/* -------------- */}

            <div>
              <h2>Price</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none "
                type="number"
                placeholder="Price"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 1, message: "Price must be greater than 0" },
                })}
              />
            </div>
            <div>
              <h2>Discount</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none "
                type="number"
                placeholder="Discount %"
                {...register("discount")}
              />
            </div>
            <div>
              <h2>Stock</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none "
                type="number"
                placeholder="Stock"
                {...register("stock", {
                  required: "Stock is required",
                  min: { value: 0, message: "Stock can't be negative" },
                })}
              />
            </div>
          </div>
          {/* Attributes section */}
          <h1 className="font-bold underline ">Attributes</h1>

          <div className="grid grid-cols-2 lg:grid-cols-3  gap-2  w-full sm:gap-8 justify-between items-center max-w-md">
            <div>
              <h2 className=" text-gray-700 ">Color</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none"
                placeholder="Color"
                {...register("color")}
              />
            </div>

            {/* -------------- */}

            <div>
              <h2>Material</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none "
                type="text"
                placeholder="Material"
                {...register("material")}
              />
            </div>
            <div>
              <h2>Weight</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none "
                type="number"
                placeholder="Weight"
                {...register("weight")}
              />
            </div>
            <div>
              <h2>Length</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none "
                type="number"
                placeholder="Length"
                {...register("length")}
              />
            </div>
            <div>
              <h2>Width</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none "
                type="number"
                placeholder="Width"
                {...register("width")}
              />
            </div>
            <div>
              <h2>Height</h2>
              <input
                className="border border-gray-300 rounded p-2 w-30 outline-none "
                type="number"
                placeholder="Height"
                {...register("height")}
              />
            </div>
          </div>

          <div>
            <h2>Tags</h2>
            <input
              className="border border-gray-300 rounded max-w-md p-2 w-full outline-none"
              placeholder="comma separated tags "
              {...register("tags")}
            />
          </div>
          <h2>Flags</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 sm:grid-row gap-2  w-full sm:gap-8 justify-between items-center max-w-md">
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

          {/* Toggle */}
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

                  <div className="flex items-end ml-8 pb-2 ">
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="text-red-500"
                    >
                      <img
                        className="w-5 h-5 "
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
                className="mt-2 border px-3 py-1 max-w-md"
              >
                + Add Variant
              </button>
            </>
          )}

          <br />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-between w-full max-w-md py-2 px-4 rounded text-white ${
              isSubmitting ? "bg-gray-400" : "bg-black hover:bg-gray-800"
            }`}
          >
            {isSubmitting ? "ADD PRODUCT..." : "ADD PRODUCT"}
            <img
              src={assets.white_arrow}
              alt="Arrow"
              className="w-4 h-4 mr-2"
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Add;
