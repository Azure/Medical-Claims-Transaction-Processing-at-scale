
import React, { useState, useEffect, useRef } from 'react';
import { Table, Spinner, Pagination, Button, Textarea } from 'flowbite-react';
import Link from 'next/link';
import moment from 'moment';

import { SparklesIcon } from '@heroicons/react/24/outline';
import TransactionsStatement from '../../hooks/TransactionsStatement';
import { AcknowledgeButton, DenyClaimButton, ProposeClaimButton, ApproveClaimButton } from './ClaimActions';
import { Modal } from 'flowbite-react';
import DataTable from '../../components/DataTable';

let money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const tableHeaders = [
	{ key: 'procedureCode', name: 'Procedure Code'},
	{ key: 'description', name: 'Description'},
	{ key: 'serviceDate', name: 'Service Date'},
	{ key: 'amount', name: 'Amount'},
	{ key: 'discount', name: 'Discount'},
];

function formatValues(header, value, row) {
	switch(header.key) {
		case 'serviceDate':
			return moment(value).format('YYYY-MM-DD');
			break;
		case 'discount':
			return money.format(value);
			break;
		default:
			return value ? value : '-';
	}	
}

export default function ClaimDetails({ claimId, requestClaims }){
	const { data, isLoading } = TransactionsStatement.GetClaimDetails(claimId);
	const [page, setPage] = useState(1);
	const [lineItems, setLineItems] = useState([]);

	return((!isLoading && data) ? (
		<>
			<div className="card">
				<div className="card-header grid grid-cols-2">
					<h4 className="card-title">Claim Details</h4>
					<div className='text-right'><label>Filing Date: </label>{ moment(data.filingDate).format('MMMM DD, YYYY') }</div>
					{/*<div className="justify-end">
						<Button color="dark" className="p-0" onClick={onClickRecommend}>
							<SparklesIcon className="h-6 w-6 text-gray-500 mr-3 text-white" />
							<h4>Make Recommendation</h4>
						</Button>
					</div>*/}
				</div>
				<div className="card-body">
					<div className="relative overflow-x-auto sm:rounded">
						<div className='grid grid-cols-2 w-9/12'>
							<div className='px-4 font-bold gap-2'>Claim Id:</div>
							<div className='float-left'>{data.claimId}</div>
							<div className='px-4 font-bold gap-2'>Claim Status:</div>
							<div>
								{ data.claimStatus } 
								{/*<ClaimsActions claimStatus={data.ClaimStatus} claimId={data.claimId} {...{data, requestClaims, lineItems}}/>*/}
							</div>
							<div className='px-4 font-bold gap-2'>Payer Name:</div>
							<div>{data.payerName ? data.payerName : '-'}</div>
							<div className='px-4 font-bold gap-2'>Total Amount:</div>
							<div>{money.format(data.totalAmount)}</div>
							<div className='px-4 font-bold gap-2'>Provider Name:</div>
							<div>{data.providerName}</div>
							<div className='px-4 font-bold gap-2'>Comment:</div>
							<div>{data.comment}</div>
						</div>
						<div>
							<h4 className="card-title mt-10 mb-10">Line Items</h4>
							<DataTable
								headers={tableHeaders}
								data={data?.lineItems ?? []}
								page={page}
								onPageChange={(newPage) => setPage(newPage)}
								rowFormatter={formatValues}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	) : <Spinner aria-label="Loading..." />);
}
