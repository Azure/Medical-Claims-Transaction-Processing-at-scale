
import { useState } from 'react';
import moment from 'moment';

import TransactionsStatement from '../../hooks/TransactionsStatement';
import Formatters from '../../hooks/Formatters';
import DataTable from '../../components/DataTable';


const tableHeaders = [
	{ key: 'procedureCode', name: 'Procedure Code' },
	{ key: 'description', name: 'Description' },
	{ key: 'serviceDate', name: 'Service Date' },
	{ key: 'amount', name: 'Amount' }
];

function formatValues(header, value, row) {
	switch(header.key) {
		case 'serviceDate':
			return moment(value).format('YYYY-MM-DD');
			break;
		case 'amount':
		case 'discount':
			return Formatters.FormatMoney(value);
			break;
		default:
			return value ? value : '-';
	}	
}

export default function ClaimHistory({ claimId }) {
	const claimRequest = TransactionsStatement.GetClaimDetails(claimId);
	const historyRequest = TransactionsStatement.GetClaimHistory(claimId);

	return ((!claimRequest.isLoading && claimRequest.data) ? (
		<div scroll-id={(!claimRequest.isLoading && !historyRequest.isLoading) ? 'claim-history' : ''} className="shadow-md">
			<div className="card mt-10">
				<div className="card-header grid grid-cols-2">
					<h4 className="card-title">Claim History</h4>
					<div className='text-right'><label>Filing Date: </label>{ moment(claimRequest.data.filingDate).format('MMMM DD, YYYY') }</div>
				</div>
				<div className="card-body">
					<div className="relative overflow-x-auto sm:rounded">
						<div className="grid grid-cols-2">
							<div>
								<div className="grid grid-cols-2 w-9/12">
									<div className="px-4 font-bold gap-2">Claim Id:</div>
									<div className="float-left">{claimRequest.data.claimId}</div>
									<div className="px-4 font-bold gap-2">Claim Status:</div>
									<div>
										<span className="bg-yellow-100">{claimRequest.data.claimStatus}</span>
									</div>
									<div className="px-4 font-bold gap-2">Member Id:</div>
									<div className="float-left">{claimRequest.data.memberId}</div>
									<div className="px-4 font-bold gap-2">Payer Name:</div>
									<div>{claimRequest.data.payerName ?? '-'}</div>
									<div className="px-4 font-bold gap-2">Total Amount:</div>
									<div>{Formatters.FormatMoney(claimRequest.data.totalAmount)}</div>
									<div className="px-4 font-bold gap-2">Provider Name:</div>
									<div>{claimRequest.data.providerName}</div>
									<div className="px-4 font-bold gap-2">Comment:</div>
									<div>{claimRequest.data.comment}</div>
								</div>
							</div>
							<div className="align-text-top text-right">
								<div>Modified By: {claimRequest.data.modifiedBy}</div>
								<div>Modified On: {Formatters.FormatDate(claimRequest.data.modifiedOn)}</div>
							</div>
						</div>
						<div>
							<h4 className="card-title mt-10 mb-10">Line Items</h4>
							<DataTable
								headers={tableHeaders}
								data={claimRequest.data.lineItems}
								rowFormatter={formatValues}
							/>
						</div>
					</div>
				</div>
			</div>

			{(!historyRequest.isLoading && historyRequest.data) ? (
				historyRequest.data.history.map((item) => {
					return(<HistoryItem key={item.id} data={item}/>)
				})
			) : null}
		</div>
	) : null);
}

function HistoryItem({ data }) {
	return (
		<div className="card bg-gray-200 mt-1">
			<div className="card-body">
				<div className="relative overflow-x-auto sm:rounded">
					<div className="grid grid-cols-2">
						<div>
							<div className="grid grid-cols-2 w-9/12">
								<div className="px-4 font-bold gap-2">Claim Id:</div>
								<div className="float-left">{data.claimId}</div>
								<div className="px-4 font-bold gap-2">Claim Status:</div>
								<div>{data.claimStatus}</div>
								<div className="px-4 font-bold gap-2">Payer Name:</div>
								<div>{data.payerName ? data.payerName : '-'}</div>
								<div className="px-4 font-bold gap-2">Total Amount:</div>
								<div>{Formatters.FormatMoney(data.totalAmount)}</div>
								<div className="px-4 font-bold gap-2">Provider Name:</div>
								<div>{data.providerName}</div>
								<div className="px-4 font-bold gap-2">Comment:</div>
								<div>{data.comment}</div>
							</div>							
						</div>
						<div className="align-text-top text-right">
							<div>Modified By: {data.modifiedBy}</div>
							<div>Modified On: {Formatters.FormatDate(data.modifiedOn)}</div>
						</div>
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
	);
}
