// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { AddProductsRequest } from "src/redux/action/product/productAction";
// import { useFormik, FormikProvider } from "formik";
// import { Dialog } from "primereact/dialog";
// import Select from "react-select";

// export default function Create(props) {
//   const [showModal, setShowModal] = useState(false);
//   const dispatch = useDispatch();

//   const formik = useFormik({
//     initialValues: {
//       product_name: undefined,
//       category_id: undefined,
//       price: undefined,
//       description: undefined,
//       image_base64: undefined,
//       promo: undefined,
//       original_price: undefined,
//       updated_at: undefined,
//     },

//     onSubmit: async (values, { resetForm }) => {
//       let payload = {
//         product_name: values.product_name,
//         category_id: values.category_id,
//         price: values.price,
//         description: values.description,
//         image_base64: values.image_base64,
//         promo: values.promo,
//         original_price: values.original_price,
//         updated_at: Date.now(),
//       };

//       dispatch(AddProductsRequest(payload));
//       setShowModal(false);
//       props.setRefresh(true);
//       resetForm();
//     },
//   });

//   const modal = () => {
//     props.setRefresh(true);
//     setShowModal(false);
//   };

//   return (
//     <>
//       <button
//         className="rounded bg-white p-2 text-sm uppercase text-black transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none"
//         type="button"
//         onClick={() => setShowModal(true)}
//       >
//         +Tambah
//       </button>
//       <Dialog
//         header="Tambah Produk"
//         visible={showModal}
//         onHide={() => setShowModal(!showModal)}
//         style={{ width: "50vw" }}
//         breakpoints={{ "960px": "75vw", "641px": "100vw" }}
//       >
//         <FormikProvider value={formik}>
//           <form onSubmit={formik.handleSubmit}>
//             <div className="p-4">
//               <div className="mb-4">
//                 <label>Nama Produk</label>
//                 <input
//                   className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-black "
//                   type="text"
//                   name="product_name"
//                   id="product_name"
//                   onChange={formik.handleChange}
//                   value={formik.values.product_name}
//                   placeholder="Nama Produk"
//                   autoComplete="off"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label>Kategori</label>
//                 {/* <Select options={options} /> */}
//                 <input
//                   className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-black "
//                   type="number"
//                   name="category_id"
//                   id="category_id"
//                   onChange={formik.handleChange}
//                   value={formik.values.category_id}
//                   placeholder="Kategori ID"
//                   autoComplete="off"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label>Harga</label>
//                 <input
//                   className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-black "
//                   type="number"
//                   min="0"
//                   name="price"
//                   id="price"
//                   onChange={formik.handleChange}
//                   value={formik.values.price}
//                   placeholder="Harga"
//                   autoComplete="off"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label>Deskripsi</label>
//                 <input
//                   className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-black "
//                   type="text"
//                   name="description"
//                   id="description"
//                   onChange={formik.handleChange}
//                   value={formik.values.description}
//                   placeholder="Deskripsi Produk"
//                   autoComplete="off"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label>Type</label>
//                 <select
//                   name="image_base64"
//                   id="image_base64"
//                   onChange={formik.handleChange}
//                   value={formik.values.image_base64}
//                   onBlur={formik.handleBlur}
//                   className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-black "
//                   required
//                 >
//                   <option
//                     value=""
//                     selected
//                     disabled
//                     hidden
//                     className="text-black"
//                   >
//                     Choose Measure Unit
//                   </option>
//                   <option value={"Debet"}>Debet</option>
//                   <option value={"Credit Card"}>Credit Card</option>
//                   <option value={"Payment"}>Payment</option>
//                 </select>
//               </div>
//             </div>
//             <div className="border-slate-200 flex items-center justify-end rounded-b border-t border-solid p-6">
//               <button
//                 className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
//                 type="button"
//                 onClick={modal}
//               >
//                 Close
//               </button>
//               <button
//                 className="bg-moderateBlue active:bg-moderateBlue hover:bg-coldBlue mb-1 mr-1 rounded px-6 py-3 text-sm font-bold uppercase text-black shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none"
//                 type="submit"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </form>
//         </FormikProvider>
//       </Dialog>
//     </>
//   );
// }
