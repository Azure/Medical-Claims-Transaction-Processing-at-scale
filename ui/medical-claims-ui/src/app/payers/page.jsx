'use client';

import React, { useState } from 'react';
import TransactionsStatement from '../hooks/TransactionsStatement';
import DataTable from '../components/DataTable';


const tableHeaders = [
	{ key: 'name', name: 'Name'},
	{ key: 'email', name: 'Email'},
	{ key: 'phoneNumber', name: 'Phone Number'},
	{ key: 'country', name: 'Country'}
];

export default function Payers() {	
	const [page, setPage] = useState(1);
	const { data, isLoading } = TransactionsStatement.GetPayers(page, 10);

	return(
		<>
			<div className="card">
				<div className="card-header">
					<h4 className="card-title">Payers</h4>
				</div>
				<div className="card-body">
					<DataTable
						isLoading={isLoading}
						headers={tableHeaders}
						data={data}
						pagination={true}
						page={page}
						onPageChange={(newPage) => setPage(newPage)}
					/>
				</div>
			</div>
		</>
	);
}
