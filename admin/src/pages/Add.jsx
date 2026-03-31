import { useFieldArray, useForm } from "react-hook-form";
import { assets } from "../assets/assets";
import { useState } from "react";

const Add = () => {
  const [show, setShow] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
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

  const onSubmit = (data) => {
    console.log(data);
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
              className={`block w-full   py-2 px-4 flex flex-col items-center justify-center text-center cursor-pointer mb-4 lg:py-7 ${imagesPreview[index] ? "" : " border border-gray-600 border-1 rounded border-dashed"}`}
            >
              {imagesPreview[index] ? (
                <img
                  src={URL.createObjectURL(imagesPreview[index])}
                  alt=""
                  className="w-40 h-40 object-cover mb-2"
                />
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
                {...register(`images.${index}.file`)}
                onChange={(e) => handleImageChange(index, e)}
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
              {...register("name")}
            />
          </div>
          <textarea
            className="border w-full max-w-md p-2 outline-none border-gray-300 rounded px-4 min-h-[100px]  resize-none"
            placeholder="Description"
            {...register("description")}
          />
          <textarea
            className="border w-full max-w-md p-2 outline-none border-gray-300 rounded px-4 min-h-[50px]  resize-none"
            placeholder="shortDescription"
            {...register("shortDescription")}
          />
          {/* -------------- */}
          {/* CATEGORY */}
          <div className="grid grid-cols-2 lg:grid-cols-3  gap-2  w-full sm:gap-8 justify-between items-center max-w-md">
            <div>
              <h2 className=" text-gray-700 ">Category</h2>
              <select
                className="border border-gray-300 rounded p-2 w-30"
                {...register("category")}
              >
                <option value="chair">Chair</option>
                <option value="table">Table</option>
                <option value="sofa">Sofa</option>
              </select>
            </div>
            <div>
              <h2 className=" text-gray-700 ">Sub category</h2>
              <select
                className="border border-gray-300 rounded p-2 w-30"
                {...register("subCategory")}
              >
                <option value="office">Office</option>
                <option value="home">Home</option>
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
                {...register("price")}
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
                {...register("stock")}
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
                type="number"
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
                      placeholder="Size (M/L)"
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
            className="w-full max-w-md bg-black text-white p-2 sm:p-3 mb-30 "
            type="submit"
          >
            ADD PRODUCT
          </button>
        </div>
      </div>
    </form>
  );
};

export default Add;
