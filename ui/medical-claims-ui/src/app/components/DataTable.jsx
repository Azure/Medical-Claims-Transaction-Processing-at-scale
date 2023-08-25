
import { useState } from 'react';
import { Table, Pagination, Spinner } from 'flowbite-react';


export default function Datatable(props) {
	let { isLoading, headers = [], data = [], page = 1, onPageChange, extraRowItems = [], extraHeaders = [] } = props;

	return (
		<>
			{!isLoading ? (
				/* Table */
				<Table className="w-full" hoverable>

					{/* Table headers */}
					<Table.Head>
						{headers.map((header) => (
							<Table.HeadCell key={header.key} className="!p-4">
								{header.name}
							</Table.HeadCell>
						))}

						{ extraHeaders }
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

								{ extraRowItems && extraRowItems(row) }
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			) :
				<div className='text-center mt-10 mb-10'>
					<Spinner aria-label="Loading..." />
				</div>
			}

			{/* Pagination */}
			<Pagination
				className="p-6 flex justify-center"
				currentPage={page}
				onPageChange={(newPage) => onPageChange(newPage)}
				totalPages={100}
			/>
		</>
	);
};
