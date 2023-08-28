'use client';

import { useState } from 'react';
import Link from 'next/link';

import TransactionsStatement from '../hooks/TransactionsStatement';
import { Table } from 'flowbite-react';
import MemberDetail from './MemberDetail';
import MemberCoverageModal from './MemberCoverageModal';
import ClaimList from '../member/claims/ClaimList';
import DataTable from '../components/DataTable';


const tableHeaders = [
	{ key: 'firstName', name: 'First Name' },
	{ key: 'lastName', name: 'Last Name' },
	{ key: 'state', name: 'State' },
	{ key: 'memberType', name: 'Member Type' },
	{ key: 'approvedCount', name: 'Approved Count' },
	{ key: 'approvedTotal', name: 'Approved Total' }
];

const onClickMemberDetail = (memberId, setShowMemberDetail, setMemberId) => {
	setShowMemberDetail(true);
	setMemberId(memberId);
}

const onClickMemberCoverage = (memberId, setShowCoverageModal, setMemberId) => {
	setShowCoverageModal(true);
	setMemberId(memberId);
}

const onClickViewClaims = (memberId, setShowClaimsList, setMemberId, setShowMembersTable) => {
	setShowClaimsList(true);
	setShowMembersTable(false);
	setMemberId(memberId);
}

function formatValues(header, value, row) {
	let money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

	switch (header.key) {
		case 'approvedTotal':
			return money.format(value);
			break;
		default:
			return value ? value : '-';
	}
}

export default function Members() {	
	const [ page, setPage ] = useState(1);
	const { data, isLoading } = TransactionsStatement.GetMembersList(page, 10);
	const [ showClaimsList, setShowClaimsList ] = useState(false);
	const [ showMemberDetail, setShowMemberDetail ] = useState(false);
	const [ showCoverageModal, setShowCoverageModal ] = useState(false);
	const [ memberId, setMemberId ] = useState(null);
	const [ coverageByMemberId, setCoverageByMemberId ] = useState(null);
	const [ showMembersTable, setShowMembersTable ] = useState(true);

	return (
		<>
			<div className="card shadow-md">
				<div className="card-header">
					<h4 className="card-title">Members</h4>
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
							rowFormatter={formatValues}
							extraHeaders={
								<>
									<Table.HeadCell></Table.HeadCell>
									<Table.HeadCell></Table.HeadCell>
									<Table.HeadCell></Table.HeadCell>
								</>
							}
							extraRowItems={
								(row) => (
									<>
										<Table.Cell className="!p-4">
											<span className="hover:cursor-pointer" onClick={()=> onClickMemberDetail(row.memberId, setShowMemberDetail, setMemberId)}>Details</span>
										</Table.Cell>
										<Table.Cell className="!p-4">
											<span className="hover:cursor-pointer" onClick={()=> onClickMemberCoverage(row.memberId, setShowCoverageModal, setMemberId)}>View Coverage</span>
										</Table.Cell>
										<Table.Cell className="!p-4">
											<span className="hover:cursor-pointer" onClick={()=> onClickViewClaims(row.memberId, setShowClaimsList, setMemberId, setShowMembersTable)}>View Claims</span>
										</Table.Cell>
									</>
								)
							}
						/>
					</div>
				</div>
			</div>

			{	showMemberDetail && (<MemberDetail memberId={memberId} />) }

			{ showCoverageModal && <MemberCoverageModal memberId={memberId} {...{showCoverageModal, setShowCoverageModal}} /> }
			
			{	showClaimsList && (<ClaimList memberId={memberId} />) }

		</>
	);
}
