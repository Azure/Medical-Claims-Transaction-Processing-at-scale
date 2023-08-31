'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Table, Pagination, Spinner } from 'flowbite-react';
import Moment from 'moment';

import TransactionsStatement from '../../hooks/TransactionsStatement';
import { FormatMoney } from '../../hooks/Formatters';
import ClaimDetails from './ClaimDetails';
import ClaimHistory from '../../member/claims/ClaimHistory';
import DataTable from '../../components/DataTable';

const tableHeaders = [
	{ key: 'filingDate', name: 'Filing Date' },
	{ key: 'claimId', name: 'Claim ID' },
	{ key: 'claimStatus', name: 'Claim Status', cellStyle: { backgroundColor: 'rgb(253, 248, 170)' } },
	{ key: 'providerName', name: 'Provider' },
	{ key: 'lastAdjudicatedDate', name: 'Last Adjudicated Date' },
	{ key: 'lastAmount', name: 'Last Amount' },
	{ key: 'totalAmount', name: 'Total Amount' }
];

function formatValues(header, value, row) {
	switch(header.key) {
		case 'filingDate':
			return Moment(value).format('YYYY-MM-DD');
			break;		
		case 'lastAdjudicatedDate':
			return value ? Moment(value).format('YYYY-MM-DD hh:mm a') : '-';
			break;
		case 'lastAmount':
			return FormatMoney(value);
			break;
		case 'totalAmount':
			return FormatMoney(value);
			break;
		default:
			return value ? value : '-';
	}	
}

export default function ClaimsByAdjudicator({ adjudicatorId, isManager }) {
	const [ page, setPage ] = useState(1);
	const [ sort, setSort ] = useState({ column: null, direction: null });
	const requestClaims = TransactionsStatement.GetClaimsByAdjudicatorId(adjudicatorId, { page, sort });

	const [ claimId, setClaimId ] = useState(null);
	const [ showClaimDetail, setShowClaimDetail ] = useState(false);
	const [ showHistory, setShowHistory ] = useState(false);

	const [ changeDetail, setChangeDetail ] = useState(false);

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
			<div className="card mb-10 shadow-md">
				<div className="card-header">
					<h4 className="card-title">Claims Assigned to { isManager ? 'Manager' : 'Adjudicator' }</h4>
				</div>
				<div className="card-body">
					<div className="relative overflow-x-auto sm:rounded">
						<DataTable
							isLoading={requestClaims.isLoading}
							headers={tableHeaders}
							data={requestClaims.data?.items}
							pagination={true}
							page={page}
							totalPages={requestClaims.data?.totalPages}
							onPageChange={(newPage) => setPage(newPage)}
							sortEnabled={true}
							onSortChange={(sort) => setSort(sort)}
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
											<span className="hover:cursor-pointer" onClick={()=> viewDetails(row.claimId)}>Details</span>
										</Table.Cell>
									 	<Table.Cell>
											<span className="hover:cursor-pointer" onClick={()=> viewHistory(row.claimId)}>View History</span>
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
