'use client';

import { useState } from 'react';
import TransactionsStatement from '../hooks/TransactionsStatement'
import DataTable from '../components/DataTable';


const tableHeaders = [
	{ key: 'name', name: 'Name' },
	{ key: 'email', name: 'Email' },
	{ key: 'phoneNumber', name: 'PhoneNumber' },
	{ key: 'country', name: 'Country' },
	// { key: 'city', name: 'City' },
	// { key: 'state', name: 'State' }
];

export default function Providers() {	
	const [ page, setPage ] = useState(1);
	const [ sort, setSort ] = useState({ column: null, direction: null });
	const { data, isLoading } = TransactionsStatement.GetProviders({ page, sort });

	return (
		<div className="card shadow-md">
			<div className="card-header">
				<h4 className="card-title">Providers</h4>
			</div>

			<div className="card-body">
				<div className="relative overflow-x-auto sm:rounded">
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
		</div>
	);
}
