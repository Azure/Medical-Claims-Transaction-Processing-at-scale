'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Table, Pagination, Spinner } from 'flowbite-react';
import Moment from 'moment';

import TransactionsStatement from '../../hooks/TransactionsStatement';
import ClaimDetails from './ClaimDetails';
import ClaimHistory from '../../member/claims/ClaimHistory';
import DataTable from '../../components/DataTable';

const tableHeaders = [
	{ key: 'filingDate', name: 'Filing Date'},
	{ key: 'claimId', name: 'Claim ID'},
	{ key: 'claimStatus', name: 'Claim Status'},
	{ key: 'payerName', name: 'Payer'},
	{ key: 'lastAdjudicatedDate', name: 'Last Adjudicated Date'},
	{ key: 'lastAmount', name: 'Last Amount'},
	{ key: 'totalAmount', name: 'Total Amount'}
];

function formatValues(header, value, row) {
	let money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

	switch(header.key) {
		case 'filingDate':
			return Moment(value).format('YYYY-MM-DD');
			break;		
		case 'lastAdjudicatedDate':
			return value ? Moment(value).format('YYYY-MM-DD hh:mm a') : '-';
			break;
		case 'lastAmount':
			return money.format(value);
			break;
		case 'totalAmount':
			return money.format(value);
			break;
		default:
			return value ? value : '-';
	}	
}

export default function ClaimsByAdjudicator({adjudicatorId, isManager}) {
	const [page, setPage] = useState(1);

	const requestClaims = TransactionsStatement.GetClaimsByAdjudicatorId(adjudicatorId, page, 5);

	const [claimId, setClaimId] = useState(null);
	const [showClaimDetail, setShowClaimDetail] = useState(false);
	const [showHistory, setShowHistory] = useState(false);

	const [changeDetail, setChangeDetail] = useState(false);

	const viewDetails = (claimId) => {
		setClaimId(claimId);
		setShowClaimDetail(true);
		setShowHistory(false);
	}

	const viewHistory = (claimId) => {
		setClaimId(claimId);
		setShowHistory(true);
		setShowClaimDetail(false);
	}

	useEffect(() => {
		if (changeDetail) {
			requestClaims.mutate();
			setChangeDetail(false);
		}
	}, [changeDetail]);

	return (
		<>
			<div className="card mb-10">
				<div className="card-header">
					<h4 className="card-title">Claims</h4>
				</div>
				<div className="card-body">
					<div className="relative overflow-x-auto sm:rounded">
						<DataTable
							isLoading={requestClaims.isLoading}
							headers={tableHeaders}
							data={requestClaims.data}
							pagination={true}
							page={page}
							onPageChange={(newPage) => setPage(newPage)}
							rowFormatter={formatValues}
							extraHeaders={
								<>
									<Table.HeadCell></Table.HeadCell>
									<Table.HeadCell></Table.HeadCell>
								</>
							}
							extraRowItems={
								(row) => (
									<>
										<Table.Cell>
											<Link href='#' onClick={()=> viewDetails(row.claimId)}>Details</Link>
										</Table.Cell>
									 	<Table.Cell>
											<Link href='#' onClick={()=> viewHistory(row.claimId)}>View History</Link>
										</Table.Cell>
									</>
								)
							}
						/>
					</div>
				</div>
			</div>

			{showClaimDetail && <ClaimDetails {...{claimId, requestClaims, isManager, setChangeDetail}} />}	

			{showHistory && <ClaimHistory {...{claimId}} />}
		</>
	);
}
