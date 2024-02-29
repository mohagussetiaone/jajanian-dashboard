import TableThree from 'components/Tables/TableThree';

export default function CategoryProductList() {
  // const dispatch = useDispatch();
  // const { productCategorys } = useSelector(
  //   (state) => state.productCategoryState
  // );
  // const dt = useRef(null);
  // const [loading, setLoading] = useState(false);
  // const [first, setFirst] = useState(0);
  // const [search, setSearch] = useState("");
  // const [refresh, setRefresh] = useState(false);
  // const [id, setId] = useState();
  // const [kebabMenu, setKebabMenu] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  // const [showModalEdit, setShowModalEdit] = useState(false);
  // let [isOpen, setIsOpen] = useState(true);
  // const [filters, setFilters] = useState({
  //   global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  // });

  // useEffect(() => {
  //   dispatch(GetProductsCategoryRequest());
  //   setLoading(true);
  //   setRefresh(false);
  // }, [dispatch, refresh]);

  // console.log("productCategorys", productCategorys);
  // const handleSearch = (e) => {
  //   const value = e.target.value;
  //   let _filters = { ...filters };
  //   _filters["global"].value = value;
  //   setFilters(_filters);
  //   setSearch(value);
  // };

  // const cols = [
  //   { field: "category_id", header: "ID" },
  //   { field: "category_name", header: "Nama Kategori" },
  //   { field: "created_at", header: "Tanggal Buat" },
  //   { field: "updated_at", header: "Tanggal Update" },
  // ];

  // const exportColumns = cols.map((col) => ({
  //   title: col.header,
  //   dataKey: col.field,
  // }));

  // const exportCSV = () => {
  //   const csvData = Papa.unparse(productCategorys);
  //   const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  //   saveAs(blob, "productCategories.csv");
  // };

  // const exportPdf = () => {
  //   import("jspdf").then((jsPDF) => {
  //     import("jspdf-autotable").then(() => {
  //       const doc = new jsPDF.default(0, 0);
  //       doc.autoTable(exportColumns, productCategorys);
  //       doc.save("productCategory.pdf");
  //     });
  //   });
  // };

  // const exportExcel = () => {
  //   import("xlsx").then((xlsx) => {
  //     const worksheet = xlsx.utils.json_to_sheet(productCategorys);
  //     const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
  //     const excelBuffer = xlsx.write(workbook, {
  //       bookType: "xlsx",
  //       type: "array",
  //     });
  //     saveAsExcelFile(excelBuffer, "productCategorys");
  //   });
  // };

  // const saveAsExcelFile = (buffer, fileName) => {
  //   import("file-saver").then((module) => {
  //     if (module && module.default) {
  //       let EXCEL_TYPE =
  //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  //       let EXCEL_EXTENSION = ".xlsx";
  //       const data = new Blob([buffer], {
  //         type: EXCEL_TYPE,
  //       });
  //       module.default.saveAs(
  //         data,
  //         fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
  //       );
  //     }
  //   });
  // };

  // const displayKebabMenu = (id) => {
  //   setId(id);
  //   setKebabMenu(!kebabMenu);
  // };

  // const formatDate = (value) => {
  //   const date = new Date(value);
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //   const year = date.getFullYear().toString().substr(-2);
  //   const hours = date.getHours().toString().padStart(2, "0");
  //   const minutes = date.getMinutes().toString().padStart(2, "0");
  //   return `${day}/${month}/${year} ${hours}:${minutes}`;
  // };

  // const dateBodyTemplate = (rowData, column) => {
  //   const formattedDate = formatDates(rowData[column.field]);
  //   return <>{formattedDate}</>;
  // };

  // const header = (
  //   <div className="flex justify-between gap-2">
  //     <div className="relative mb-4">
  //       <div className="flex justify-end gap-4">
  //         <div className="pointer-events-none absolute inset-y-0 right-[410px] hidden items-center pl-1 md:block">
  //           <IoIosSearch className="hidden h-5 w-5  text-gray-600 md:mt-2 md:block" />
  //         </div>
  //         <input
  //           type="search"
  //           id="default-search"
  //           className="block w-[140px] rounded-lg border border-gray-300 bg-gray-50 py-2 pl-2 pr-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:w-[300px] md:pl-10 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
  //           placeholder="Cari Produk"
  //           onChange={handleSearch}
  //           value={search}
  //           autoComplete="off"
  //         />
  //         <button
  //           className="rounded-md bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700"
  //           onClick={() => setShowModal(!showModal)}
  //         >
  //           <span className="hidden md:block">Tambah Category</span>
  //           <span className="flex md:hidden">
  //             <IoMdAdd className="p-0 md:ml-2" />
  //           </span>
  //         </button>
  //       </div>
  //     </div>
  //     <div className="flex">
  //       <Button
  //         type="button"
  //         icon="pi pi-file"
  //         size="large"
  //         rounded
  //         onClick={exportCSV}
  //         data-pr-tooltip="CSV"
  //         tooltip="Export to CSV"
  //       />
  //       <Button
  //         type="button"
  //         icon="pi pi-file-excel"
  //         size="large"
  //         severity="success"
  //         rounded
  //         onClick={exportExcel}
  //         data-pr-tooltip="XLS"
  //         tooltip="Export to XLS"
  //       />
  //       <Button
  //         type="button"
  //         icon="pi pi-file-pdf"
  //         size="large"
  //         severity="warning"
  //         rounded
  //         onClick={exportPdf}
  //         data-pr-tooltip="PDF"
  //         tooltip="Export to PDF"
  //       />
  //     </div>
  //   </div>
  // );

  return (
    <div>
      <TableThree />
    </div>
  );
}
