
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
		totalPages = 100,
		onPageChange = () => {},
		sortEnabled = false,
		onSortChange = () => {},
		extraHeaders,
		extraRowItems,
		rowFormatter
	} = props;

	if (!Array.isArray(data)) {
		console.error('Data passed to DataTable is not an array.');
	}

	if (!Array.isArray(headers)) {
		console.error('Headers passed to DataTable is not an array.');
	}

	const formatRowItem = (header, value, row) => {
		return rowFormatter ? rowFormatter(header, value, row) : (value ? value : '-');
	}

	const [ sortColumn, setSortColumn ] = useState(null);
	const [ sortDirection, setSortDirection ] = useState(null);
	const [ sortIcon, setSortIcon ] = useState('');

	/*
		header clicked:
			sort column ASC
			sort column DESC
			do not sort column
	*/
	const onHeaderClicked = (header) => {		
		if (!sortEnabled) return;

		let oldSortDirection = sortDirection;

		// Reset sort direction when column changes
		if (header.key !== sortColumn) {
			oldSortDirection = null;
		}

		let newSortDirection = '';
		let newSortIcon = '';

		switch (oldSortDirection) {
			case null:
				newSortDirection = 'asc';
				newSortIcon = '▲';
				break;
			case 'asc':
				newSortDirection = 'desc';
				newSortIcon = '▼';
				break;
			case 'desc':
				newSortDirection = null;
				newSortIcon = '';
			 break;
		}

		setSortColumn(header.key);
		setSortDirection(newSortDirection);
		setSortIcon(newSortIcon);
		onSortChange({ column: header.key, direction: newSortDirection });
	}

	return (
		<>
			{!isLoading ? (
				/* Table */
				<Table className="w-full" hoverable>

					{/* Table headers */}
					<Table.Head>
						{headers.map((header) => (
							<Table.HeadCell key={header.key} onClick={() => onHeaderClicked(header)} style={{ cursor: 'pointer' }}>
								{header.name} {sortColumn === header.key ? sortIcon : null}
							</Table.HeadCell>
						))}

						{ extraHeaders }
					</Table.Head>

					{/* Table body */}
					<Table.Body className="divide-y">
						{Array.isArray(data) && data.map((row, rowIndex) => (
							<Table.Row key={rowIndex} className="bg-white dark:border-gray-700 dark:bg-gray-800">
								{Array.isArray(headers) && headers.map((header, cellIndex) => (
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

			{!isLoading && (data == false) && <span className="flex justify-center my-5">No data.</span>}

			{/* Pagination */}
			{pagination && totalPages > 1 && <Pagination
				theme={paginationTheme}
				className="p-6 flex justify-center"
				currentPage={page}
				onPageChange={(newPage) => onPageChange(newPage)}
				totalPages={totalPages}
			/>}
		</>
	);
};
