
import { useState } from 'react';
import Link from 'next/link';
import moment from 'moment';

import { Table } from 'flowbite-react';
import TransactionsStatement from '../../hooks/TransactionsStatement';
import { FormatMoney } from '../../hooks/Formatters';
import ClaimDetails from './ClaimDetails';
import ClaimHistory from './ClaimHistory';
import DataTable from '../../components/DataTable';


const tableHeaders = [
	{ key: 'filingDate', name: 'Filing Date' },
	{ key: 'claimStatus', name: 'Claim Status', cellStyle: { backgroundColor: 'rgb(253, 248, 170)' } },
	{ key: 'providerName', name: 'Provider' },
	{ key: 'lastAdjudicatedDate', name: 'Last Adjucated Date' },
	{ key: 'lastAmount', name: 'Last Amout' },
	{ key: 'totalAmount', name: 'Total Amount' }
];

function formatValues(header, value, row) {
	switch(header.key) {
		case 'filingDate':
			return moment(value).format('YYYY-MM-DD');
			break;		
		case 'lastAdjudicatedDate':
			return value ? moment(value).format('YYYY-MM-DD hh:mm a') : '-';
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

export default function ClaimList({ memberId }) {
	const [ page, setPage ] = useState(1);
	const [ sort, setSort ] = useState({ column: null, direction: null });

	const requestMember = TransactionsStatement.GetMember(memberId);
	const requestClaims = TransactionsStatement.GetClaimsByMemberId(memberId, { page, sort });

	const [ claimId, setClaimId ] = useState(null);
	const [ showClaimDetail, setShowClaimDetail ] = useState(false);
	const [ showHistory, setShowHistory ] = useState(false);

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
			<div className="card mt-10 shadow-md">
				<div className="card-header">
					{(!requestMember.isLoading && requestMember.data) && (
						<h4 className="card-title">Member Claims for {requestMember.data.firstName} {requestMember.data.lastName}</h4>
					)}
				</div>
				<div className="card-body">
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

			{showClaimDetail && <ClaimDetails {...{claimId, requestClaims}} />}		

			{showHistory && <ClaimHistory {...{claimId}} />}	

		</>
	);
}
