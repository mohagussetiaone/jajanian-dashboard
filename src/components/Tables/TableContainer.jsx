import React, { useState } from 'react';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from '@tanstack/react-table';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

const TableContainer = ({
  datas,
  columns,
  TableName,
  handleAddModalOpen,
  isDownload,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data: datas,
    columns,
    state: {
      globalFilter,
      sorting, // ketika di klik tablenya / sorting manual
      columnFilters, // untuk memfilter tiap kolum tapi belom di terapkan
      columnVisibility,
      // rowSelection,
    },
    //  - SET STATE
    enableRowSelection: true,
    // onRowSelectionChange: setRowSelection, // baru
    onSortingChange: setSorting, // sorting manual
    OnGlobalFilterChange: setGlobalFilter, // lama
    onColumnFiltersChange: setColumnFilters, // baru
    onColumnVisibilityChange: setColumnVisibility, // baru
    //  -  OPSI LAMA
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //  - OPSI BARU
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  const exportCSV = () => {
    const dateNow = new Date().toLocaleDateString('id-ID');
    const excludedColumns = ['image_base64', 'description'];
    const filteredData =
      datas &&
      datas.map((rowData) => {
        const filteredRow = {};
        Object.keys(rowData).forEach((key) => {
          if (!excludedColumns.includes(key)) {
            filteredRow[key] = rowData[key];
          }
        });
        return filteredRow;
      });
    const csvData = Papa.unparse(filteredData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${TableName}_${dateNow}.csv`);
  };

  const exportToExcel = () => {
    const dateNow = new Date().toLocaleDateString('id-ID');
    const excludedColumns = ['image_base64', 'description'];
    const filteredData =
      datas &&
      datas.map((rowData) => {
        const filteredRow = {};
        Object.keys(rowData).forEach((key) => {
          if (!excludedColumns.includes(key)) {
            filteredRow[key] = rowData[key];
          }
        });
        return filteredRow;
      });
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    XLSX.writeFile(wb, `${TableName}_${dateNow}.xlsx`);
  };

  const exportPdf = () => {
    const dateNow = new Date().toLocaleDateString('id-ID');
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((autoTable) => {
        const excludedColumns = ['image_base64', 'description']; // Add more column names if needed
        const columns = Object.keys(datas[0])
          .filter((field) => !excludedColumns.includes(field))
          .map((field) => ({
            title: field,
            dataKey: field,
          }));
        const filteredData =
          datas &&
          datas.map((rowData) => {
            const filteredRow = {};
            Object.keys(rowData).forEach((key) => {
              if (!excludedColumns.includes(key)) {
                filteredRow[key] = rowData[key];
              }
            });
            return filteredRow;
          });
        const doc = new jsPDF.default();
        autoTable.default(doc, {
          head: [columns.map((col) => col.title)],
          body: filteredData.map((row) =>
            columns.map((col) => row[col.dataKey]),
          ),
        });
        doc.save(`${TableName}_${dateNow}.pdf`);
      });
    });
  };

  return (
    <>
      <div className="flex justify-between m-4">
        <div className="flex gap-4 search-box">
          <div>
            <input
              type="text"
              id="search"
              name="search"
              value={globalFilter}
              className="form-control search px-4 py-2 rounded-lg w-[120px] md:w-full placeholder:text-sm placeholder:text-gray-700 dark:bg-navy-900 border-gray-700 shadow"
              placeholder={`Cari ${TableName ?? ''}...`}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
              }}
            />
            <i className="ri-search-line search-icon"></i>
          </div>
          <div onClick={handleAddModalOpen}>
            <button className="btn text-sm bg-blue-500 text-gray-100 rounded-lg p-2.5">
              Tambah <span className="hidden md:inline">{TableName}</span>
            </button>
          </div>
        </div>
        {isDownload && (
          <div className="flex gap-2 md:gap-4">
            <span onClick={exportCSV}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 128 128"
                id="download-file"
                className="w-8 h-8 cursor-pointer"
              >
                <path
                  fill="#00b8df"
                  d="M15.667 62h96v4h-96zM15.667 82H96v4H15.667zM15.667 102H83v4H15.667z"
                ></path>
                <path
                  fill="#00b8df"
                  d="M47.667 64h4v60h-4zM104 80c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm10.882 16.988-.113.176-8.232 11.438c-.548.866-1.508 1.398-2.537 1.398s-1.989-.532-2.536-1.397l-8.346-11.614a3.01 3.01 0 0 1 .01-2.994 3.01 3.01 0 0 1 2.596-1.494H100V86c0-1.654 1.346-3 3-3h2c1.654 0 3 1.346 3 3v6.5h4.276c1.065 0 2.061.572 2.596 1.494a3.01 3.01 0 0 1 .01 2.994z"
                ></path>
                <path
                  fill="#ff9a30"
                  d="m84 125.95-.05.05H84zM114 77v-.05l-.05.05z"
                ></path>
                <path
                  fill="#00b8df"
                  d="M111.071 44.243 71.757 4.929A9.936 9.936 0 0 0 64.687 2H24c-5.514 0-10 4.486-10 10v104c0 5.514 4.486 10 10 10h59.95l-4-4H24c-3.309 0-6-2.691-6-6V12c0-3.309 2.691-6 6-6h40.687c1.603 0 3.109.624 4.242 1.757l39.314 39.314A6.044 6.044 0 0 1 110 51.313V72.95l4 4V51.313c0-2.67-1.04-5.181-2.929-7.07z"
                ></path>
                <path fill="#fff" d="m113.95 77 .05-.05-4-4"></path>
              </svg>
            </span>
            <span onClick={exportToExcel}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 128 128"
                id="excel-file"
                className="w-8 h-8 cursor-pointer"
              >
                <path
                  fill="#007732"
                  d="M80.016 96h-8.297L63.75 83.039 55.781 96H48l11.367-17.672-10.64-16.594h8.016l7.383 12.328 7.242-12.328h7.828L68.438 78.727 80.016 96zM104 80c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm10.882 16.988-.113.176-8.232 11.438c-.548.866-1.508 1.398-2.537 1.398s-1.989-.532-2.536-1.397l-8.346-11.614a3.01 3.01 0 0 1 .01-2.994 3.01 3.01 0 0 1 2.596-1.494H100V86c0-1.654 1.346-3 3-3h2c1.654 0 3 1.346 3 3v6.5h4.276c1.065 0 2.061.572 2.596 1.494a3.01 3.01 0 0 1 .01 2.994z"
                ></path>
                <path
                  fill="#ff9a30"
                  d="m84 125.95-.05.05H84zM114 77v-.05l-.05.05z"
                ></path>
                <path
                  fill="#007732"
                  d="M111.071 44.243 71.757 4.929A9.936 9.936 0 0 0 64.687 2H24c-5.514 0-10 4.486-10 10v104c0 5.514 4.486 10 10 10h59.95l-4-4H24c-3.309 0-6-2.691-6-6V12c0-3.309 2.691-6 6-6h40.687c1.603 0 3.109.624 4.242 1.757l39.314 39.314A6.044 6.044 0 0 1 110 51.313V72.95l4 4V51.313c0-2.67-1.04-5.181-2.929-7.07z"
                ></path>
                <path fill="#fff" d="m113.95 77 .05-.05-4-4"></path>
              </svg>
            </span>
            <span onClick={exportPdf}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 128 128"
                id="pdf-file"
                className="w-8 h-8 cursor-pointer"
              >
                <path
                  fill="#ff402f"
                  d="M95.21 80.32c-.07-.51-.48-1.15-.92-1.58-1.26-1.24-4.03-1.89-8.25-1.95-2.86-.03-6.3.22-9.92.73-1.62-.93-3.29-1.95-4.6-3.18-3.53-3.29-6.47-7.86-8.31-12.89.12-.47.22-.88.32-1.3 0 0 1.98-11.28 1.46-15.1-.07-.52-.12-.67-.26-1.08l-.17-.44c-.54-1.25-1.6-2.57-3.26-2.5l-.98-.03h-.02c-1.86 0-3.36.95-3.76 2.36-1.2 4.44.04 11.09 2.29 19.69l-.58 1.4c-1.61 3.94-3.63 7.9-5.41 11.39l-.23.45c-1.88 3.67-3.58 6.79-5.13 9.43l-1.59.84c-.12.06-2.85 1.51-3.49 1.89-5.43 3.25-9.03 6.93-9.63 9.85-.19.94-.05 2.13.92 2.68l1.54.78c.67.33 1.38.5 2.1.5 3.87 0 8.36-4.82 14.55-15.62 7.14-2.32 15.28-4.26 22.41-5.32 5.43 3.05 12.11 5.18 16.33 5.18.75 0 1.4-.07 1.92-.21.81-.22 1.49-.68 1.91-1.3.82-1.23.98-2.93.76-4.67zM36.49 99.33c.7-1.93 3.5-5.75 7.63-9.13.26-.21.9-.81 1.48-1.37-4.32 6.89-7.21 9.63-9.11 10.5zM60.95 43c1.24 0 1.95 3.13 2.01 6.07.06 2.94-.63 5-1.48 6.53-.71-2.26-1.05-5.82-1.05-8.15 0 0-.05-4.45.52-4.45zm-7.3 40.14c.87-1.55 1.77-3.19 2.69-4.92 2.25-4.25 3.67-7.57 4.72-10.3 2.1 3.82 4.72 7.07 7.79 9.67.39.32.8.65 1.22.98-6.25 1.23-11.66 2.74-16.42 4.57zm39.43-.35c-.38.23-1.47.37-2.17.37-2.26 0-5.07-1.03-9-2.72 1.51-.11 2.9-.17 4.14-.17 2.27 0 2.94-.01 5.17.56 2.22.57 2.25 1.72 1.86 1.96z"
                ></path>
                <path
                  fill="#ff402f"
                  d="M104 80c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm10.882 16.988-.113.176-8.232 11.438c-.548.866-1.508 1.398-2.537 1.398s-1.989-.532-2.536-1.397l-8.346-11.614a3.01 3.01 0 0 1 .01-2.994 3.01 3.01 0 0 1 2.596-1.494H100V86c0-1.654 1.346-3 3-3h2c1.654 0 3 1.346 3 3v6.5h4.276c1.065 0 2.061.572 2.596 1.494a3.01 3.01 0 0 1 .01 2.994z"
                ></path>
                <path
                  fill="#ff9a30"
                  d="m84 125.95-.05.05H84zM114 77v-.05l-.05.05z"
                ></path>
                <path
                  fill="#ff402f"
                  d="M111.071 44.243 71.757 4.929A9.936 9.936 0 0 0 64.687 2H24c-5.514 0-10 4.486-10 10v104c0 5.514 4.486 10 10 10h59.95l-4-4H24c-3.309 0-6-2.691-6-6V12c0-3.309 2.691-6 6-6h40.687c1.603 0 3.109.624 4.242 1.757l39.314 39.314A6.044 6.044 0 0 1 110 51.313V72.95l4 4V51.313c0-2.67-1.04-5.181-2.929-7.07z"
                ></path>
                <path fill="#fff" d="m113.95 77 .05-.05-4-4"></path>
              </svg>
            </span>
          </div>
        )}
      </div>
      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="!border-px !border-gray-400 text-center"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-gray-200 pt-4 pb-2 pr-4 text-center"
                    >
                      <div className="items-center justify-center text-xs p-2 bg-gray-100 dark:bg-navy-700 text-black dark:text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: '',
                          desc: '',
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className="text-center border-b-[1px] border-gray-300 dark:border-navy-700 text-black dark:text-gray-200"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className="min-w-0 border-white/0 py-2 pr-4"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* pagination */}
        <div className="flex items-center justify-end mt-4 gap-2">
          <button
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
            className="border border-gray-300 disabled:opacity-30"
          >
            <MdNavigateBefore className="w-8 h-8 dark:text-gray-100" />
          </button>
          <button
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
            className="border border-gray-300 disabled:opacity-30"
          >
            <MdNavigateNext className="w-8 h-8 dark:text-gray-100" />
          </button>
          <span className="flex items-center gap-1">
            <h3 className="dark:text-gray-100">Page</h3>
            <div className="flex gap-1 flex-row">
              <strong className="dark:text-gray-100">
                {table.getState().pagination.pageIndex + 1}
              </strong>
              <strong>of </strong>
              <strong>{table.getPageCount()}</strong>
            </div>
          </span>
          <div className="hidden md:block">|</div>
          <span className="flex items-center gap-1 dark:text-gray-100">
            <span className="hidden md:inline-block">Ke</span>
            Page
            <input
              type="number"
              id="page"
              name="page"
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16 bg-transparent"
              min={1}
            />
          </span>
          <select
            id="pageSize"
            name="pageSize"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="p-1 dark:bg-navy-900 bg-transparent"
          >
            {[10, 20, 30, 50].map((pageSize, index) => (
              <option key={index} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default TableContainer;
