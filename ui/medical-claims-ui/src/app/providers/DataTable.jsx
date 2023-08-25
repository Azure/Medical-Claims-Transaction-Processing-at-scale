
import { useState, useEffect } from 'react';
import { Table, Pagination, Spinner } from 'flowbite-react';


export default function Datatable({ headers = [], data = [], page = 1, onPageChange }) {
	return (
		<>
			{/* Table */}
			<Table className="w-full" hoverable>

				{/* Table headers */}
				<Table.Head>
					{headers.map((header) => (
						<Table.HeadCell key={header.key} className="!p-4">
							{header.name}
						</Table.HeadCell>
					))}
				</Table.Head>

				{/* Table body */}
				<Table.Body className="divide-y">
					{data.map((row) => (
						<Table.Row key={row.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
							{Object.values(headers).map((header, index) => (
								<Table.Cell key={`${row.id}-${index}`} className="!p-4">
									{row[header.key] ? row[header.key] : '-'}
								</Table.Cell>
							))}
						</Table.Row>
					))}
				</Table.Body>
			</Table>

			{/* Pagination */}
			<Pagination
				className="p-6 self-center"
				currentPage={page}
				onPageChange={(newPage) => onPageChange(newPage)}
				totalPages={100}
			/>
		</>
	);
};
