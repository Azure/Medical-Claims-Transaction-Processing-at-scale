'use client';

import { useState, useEffect } from 'react';
import TransactionsStatement from '../hooks/TransactionsStatement'
import { Spinner } from 'flowbite-react';
import DataTable from './DataTable';


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
		<div>
			<div className="card-header">
				<h4 className="card-title">Providers</h4>
			</div>

			<div className="card-body">
				{!isLoading ? (
					<div className="relative overflow-x-auto sm:rounded">
						<DataTable headers={tableHeaders} data={data} page={page} onPageChange={(newPage) => setPage(newPage) } />
					</div>
				) :
					<div className='text-center mt-20'>
						<Spinner aria-label="Loading..." />
					</div>
				}
			</div>
		</div>
	);
}
