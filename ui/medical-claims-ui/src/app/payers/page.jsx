'use client';

import react, { useState } from 'react';
import TransactionsStatement from '../hooks/TransactionsStatement';
import DataTable from '../components/DataTable';


const tableHeaders = [
	{ key: 'name', name: 'Name' },
	{ key: 'email', name: 'Email' },
	{ key: 'phoneNumber', name: 'Phone Number' },
	{ key: 'country', name: 'Country' }
];

export default function Payers() {	
	const [ page, setPage ] = useState(1);
	const [ sort, setSort ] = useState({ column: null, direction: null });
	const { data, isLoading } = TransactionsStatement.GetPayers({ page, sort });

	return(
		<>
			<div className="card shadow-md">
				<div className="card-header">
					<h4 className="card-title">Payers</h4>
				</div>
				<div className="card-body">
					<DataTable
						isLoading={isLoading}
						headers={tableHeaders}
						data={data?.items}
						pagination={true}
						page={page}
						totalPages={data?.totalPages}
						onPageChange={(newPage) => setPage(newPage)}
						sortEnabled={true}
						onSortChange={(sort) => setSort(sort)}
					/>
				</div>
			</div>
		</>
	);
}
