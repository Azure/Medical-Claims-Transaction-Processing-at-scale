'use client';

import { useState } from 'react';
import TransactionsStatement from '../hooks/TransactionsStatement'
import DataTable from '../components/DataTable';


const tableHeaders = [
	{ key: 'name', name: 'Name' },
	{ key: 'email', name: 'Email' },
	{ key: 'phoneNumber', name: 'PhoneNumber' },
	{ key: 'city', name: 'City' },
	{ key: 'state', name: 'State' }
];

export default function Providers() {	
	const [page, setPage] = useState(1);
	const { data, isLoading } = TransactionsStatement.GetProviders(page, 10);

	return (
		<div className="card">
			<div className="card-header">
				<h4 className="card-title">Providers</h4>
			</div>

			<div className="card-body">
				<div className="relative overflow-x-auto sm:rounded">
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
		</div>
	);
}
