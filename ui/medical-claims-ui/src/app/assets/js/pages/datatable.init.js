/**
 * Theme: T-Wind - Tailwind Admin Dashboard Template
 * Author: Mannatthemes
 * File: Datatable Js
 */

 const dataTable = new simpleDatatables.DataTable("#datatable_1", {
	searchable: true,
	fixedHeight: false,
})

const dataTable_2 = new simpleDatatables.DataTable("#datatable_2")
    document.querySelector("button.csv").addEventListener("click", () => {
        dataTable_2.export({
            type:"csv",
            download: true,
            lineDelimiter: "\n\n",
            columnDelimiter: ";"
        })
    })
    document.querySelector("button.sql").addEventListener("click", () => {
        dataTable_2.export({
            type:"sql",
            download: true,
            tableName: "export_table"
        })
    })
    document.querySelector("button.txt").addEventListener("click", () => {
        dataTable_2.export({
            type:"txt",
            download: true,
        })
    })
    document.querySelector("button.json").addEventListener("click", () => {
        dataTable_2.export({
            type:"json",
            download: true,
            escapeHTML: true,
            space: 3
        })
    })




    