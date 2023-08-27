
import { useState } from 'react';
import Link from 'next/link';
import moment from 'moment';

import { Table } from 'flowbite-react';
import TransactionsStatement from '../../hooks/TransactionsStatement';
import ClaimDetails from './ClaimDetails';
import ClaimHistory from './ClaimHistory';
import DataTable from '../../components/DataTable';


const tableHeaders = [
	{ key: 'filingDate', name: 'Filing Date'},
	{ key: 'claimStatus', name: 'Claim Status', itemStyle: { backgroundColor: 'rgb(253, 248, 170)' }},
	{ key: 'providerName', name: 'Provider'},
	{ key: 'lastAdjudicatedDate', name: 'Last Adjucated Date'},
	{ key: 'lastAmount', name: 'Last Amout'},
	{ key: 'totalAmount', name: 'Total Amount'}
];

function formatValues(header, value, row) {
	let money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

	switch(header.key) {
		case 'filingDate':
			return moment(value).format('YYYY-MM-DD');
			break;		
		case 'lastAdjudicatedDate':
			return value ? moment(value).format('YYYY-MM-DD hh:mm a') : '-';
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

export default function ClaimList({ memberId }){
	const [page, setPage] = useState(1);

	const requestMember = TransactionsStatement.GetMember(memberId);
	const requestClaims = TransactionsStatement.GetClaimsByMemberId(memberId, page, 5);

	const [claimId, setClaimId] = useState(null);
	const [showClaimDetail, setShowClaimDetail] = useState(false);
	const [showHistory, setShowHistory] = useState(false);

	const viewDetails = (newClaimId)=> {
		setClaimId(newClaimId);
		setShowClaimDetail(true);
		setShowHistory(false);
	}

	const viewHistory = (newClaimId)=> {
		setClaimId(newClaimId);
		setShowHistory(true);
		setShowClaimDetail(false);
	}

	return (
		<>
			<div className="card mt-10">
				<div className="card-header">
					{(!requestMember.isLoading && requestMember.data) && (
						<h4 className="card-title">Member Claims for {requestMember.data.firstName} {requestMember.data.lastName}</h4>
					)}
				</div>
				<div className="card-body">
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

			{showClaimDetail && <ClaimDetails {...{claimId, requestClaims}} />}		

			{showHistory && <ClaimHistory {...{claimId}} />}	

		</>
	);
}
