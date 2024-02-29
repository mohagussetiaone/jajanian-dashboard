// import React, { useEffect, useState } from "react";
// import { FormikProvider, useFormik } from "formik";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   EditProductsRequest,
//   FindProductsRequest,
// } from "src/redux/action/product/productAction";

// export default function Edit(props) {
//   const dispatch = useDispatch();
//   const [showModal, setShowModal] = useState(false);
//   const [id, setId] = useState();
//   const { products } = useSelector((state) => state.productState);

//   useEffect(() => {
//     dispatch(FindProductsRequest(id));
//   }, [dispatch, id]);

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       usacEntityId: userAccount.usacEntityId,
//       usacUserId: userAccount.usacUserId,
//       usacAccountNumber: userAccount.usacAccountNumber,
//       usacSaldo: userAccount.usacSaldo,
//       usacType: userAccount.usacType,
//     },
//     onSubmit: async (values) => {
//       const payload = {
//         usacEntityId: values.usacEntityId,
//         usacUserId: values.usacUserId,
//         usacAccountNumber: values.usacAccountNumber,
//         usacSaldo: values.usacSaldo,
//         usacType: values.usacType,
//       };
//       dispatch(EditUserAccountRequest(payload));
//       props.setRefresh(true);
//       setShowModal(false);
//     },
//   });

//   const editButton = () => {
//     setId(props.id);
//     setShowModal(true);
//   };

//   const modal = () => {
//     props.setRefresh(true);
//     setShowModal(false);
//   };

//   return (
//     <>
//       <button
//         className="hover:bg-coldBlue w-full p-3 hover:text-white"
//         type="button"
//         onClick={editButton}
//       >
//         Edit
//       </button>
//       {showModal ? (
//         <>
//           <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
//             <div className="min-w-3xl relative mx-auto my-6 w-auto">
//               {/*content*/}
//               <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
//                 {/*header*/}
//                 <div className="border-slate-200 flex items-start justify-between rounded-t border-b border-solid p-5">
//                   <h3 className="text-3xl font-semibold">Edit User Account</h3>
//                   <button
//                     className="bg-transparent float-right ml-auto border-0 p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
//                     onClick={() => setShowModal(false)}
//                   >
//                     <span className="bg-transparent block h-6 w-6 text-2xl text-black opacity-5 outline-none focus:outline-none">
//                       ×
//                     </span>
//                   </button>
//                 </div>
//                 {/*body*/}
//                 <div className="relative flex-auto p-6">
//                   <FormikProvider value={formik}>
//                     <form onSubmit={formik.handleSubmit}>
//                       <div className="px-8 py-4">
//                         <div className="mb-4">
//                           <label className="mb-2 block text-sm font-bold text-black">
//                             Account Number
//                           </label>
//                           <input
//                             className=" min-w-3xl border-slate-900 w-full rounded border px-3 py-2 text-black "
//                             type="text"
//                             name="usacAccountNumber"
//                             id="usacAccountNumber"
//                             onChange={formik.handleChange}
//                             value={formik.values.usacAccountNumber}
//                             placeholder="Account Number"
//                             disabled
//                           />
//                         </div>
//                         <div className="mb-4">
//                           <label className="mb-2 block text-sm font-bold text-black">
//                             Saldo
//                           </label>
//                           <input
//                             className=" border-slate-900 w-full rounded border px-3 py-2 text-black"
//                             type="text"
//                             name="usacSaldo"
//                             id="usacSaldo"
//                             onChange={formik.handleChange}
//                             value={formik.values.usacSaldo}
//                             placeholder="Saldo"
//                             autoComplete="off"
//                           />
//                         </div>
//                         <div className="mb-4">
//                           <label className="mb-2 block text-sm font-bold text-black">
//                             Type
//                           </label>
//                           <select
//                             name="usacType"
//                             id="usacType"
//                             onChange={formik.handleChange}
//                             value={formik.values.usacType}
//                             className=" border-slate-900 w-full rounded border px-3 py-2 text-black"
//                           >
//                             <option
//                               value=""
//                               selected
//                               disabled
//                               hidden
//                               className="text-black"
//                             >
//                               Choose Type Account
//                             </option>
//                             <option value={"Debit"}>Debit</option>
//                             <option value={"Credit"}>Credit</option>
//                             <option value={"Fintech"}>Fintech</option>
//                           </select>
//                         </div>
//                         <div className="border-slate-200 flex items-center justify-end rounded-b border-t border-solid p-6">
//                           <button
//                             className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
//                             type="button"
//                             onClick={modal}
//                           >
//                             Close
//                           </button>
//                           <button
//                             className="bg-coldBlue active:bg-coldBlue mb-1 mr-1 rounded px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none"
//                             type="submit"
//                           >
//                             Save Changes
//                           </button>
//                         </div>
//                       </div>
//                     </form>
//                   </FormikProvider>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
//         </>
//       ) : null}
//     </>
//   );
// }
