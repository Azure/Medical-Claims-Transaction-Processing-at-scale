
import { useState } from 'react';
import moment from 'moment';

import TransactionsStatement from '../../hooks/TransactionsStatement';
import { FormatMoney } from '../../hooks/Formatters';
import { Spinner } from 'flowbite-react';
import DataTable from '../../components/DataTable';


const tableHeaders = [
	{ key: 'procedureCode', name: 'Procedure Code' },
	{ key: 'description', name: 'Description' },
	{ key: 'serviceDate', name: 'Service Date' },
	{ key: 'amount', name: 'Amount' },
	{ key: 'discount', name: 'Discount' }
];

function formatValues(header, value, row) {
	switch(header.key) {
		case 'serviceDate':
			return moment(value).format('YYYY-MM-DD');
			break;
		case 'amount':
			return FormatMoney(value);
			break;
		case 'discount':
			return FormatMoney(value);
			break;
		default:
			return value ? value : '-';
	}
}

export default function ClaimDetails({ claimId }) {
	const { data, isLoading } = TransactionsStatement.GetClaimDetails(claimId);

	return((!isLoading && data) ? (
		<>
			<div className="card mt-10 shadow-md">
				<div className="card-header grid grid-cols-2">
					<h4 className="card-title">Claim Details</h4>
					<div className='text-right'><label>Filing Date: </label>{ moment(data.filingDate).format('MMMM DD, YYYY') }</div>
				</div>
				<div className="card-body">
					<div className="relative overflow-x-auto sm:rounded">
						<div className='grid grid-cols-2 grid-cols-[auto_1fr] gap-x-8'>
							<div className='px-4 font-bold gap-2'>Claim Id:</div>
							<div>{data.claimId}</div>
							<div className='px-4 font-bold gap-2'>Claim Status:</div>
							<div>{data.claimStatus}</div>
							<div className='px-4 font-bold gap-2'>Payer Name:</div>
							<div>{data.payerName ? data.payerName : '-'}</div>
							<div className='px-4 font-bold gap-2'>Total Amount:</div>
							<div>{FormatMoney(data.totalAmount)}</div>
							<div className='px-4 font-bold gap-2'>Provider Name:</div>
							<div>{data.providerName}</div>
							<div className='px-4 font-bold gap-2'>Comment:</div>
							<div>{data.comment}</div>
						</div>
						<div>
							<h4 className="card-title mt-10 mb-10">Line Items</h4>
							<DataTable
								headers={tableHeaders}
								data={data.lineItems}
								rowFormatter={formatValues}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	) : <Spinner aria-label="Loading..." />);
}
