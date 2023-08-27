
import { useState } from 'react';
import { Table, Pagination, Spinner } from 'flowbite-react';

const paginationTheme = {
	pages: {
		selector: {
			active: 'bg-slate-200',
		}
	}
};

export default function DataTable(props) {
	let {
		isLoading,
		headers = [],
		data = [],
		pagination = false,
		page = 1,
		onPageChange = () => {},
		extraHeaders,
		extraRowItems,
		rowFormatter
	} = props;

	const formatRowItem = (header, value, row) => {
		return rowFormatter ? rowFormatter(header, value, row) : (value ? value : '-');
	}

	return (
		<>
			{!isLoading ? (
				/* Table */
				<Table className="w-full" hoverable>

					{/* Table headers */}
					<Table.Head>
						{headers.map((header) => (
							<Table.HeadCell key={header.key}>
								{header.name}
							</Table.HeadCell>
						))}

						{ extraHeaders }
					</Table.Head>

					{/* Table body */}
					<Table.Body className="divide-y">
						{data.map((row, rowIndex) => (
							<Table.Row key={rowIndex} className="bg-white dark:border-gray-700 dark:bg-gray-800">
								{Object.values(headers).map((header, cellIndex) => (
									<Table.Cell key={`${rowIndex}-${cellIndex}`} style={header.itemStyle}>
										{formatRowItem(header, row[header.key], row)}
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
			{pagination && <Pagination
				theme={paginationTheme}
				className="p-6 flex justify-center"
				currentPage={page}
				onPageChange={(newPage) => onPageChange(newPage)}
				totalPages={100}
			/>}
		</>
	);
};
