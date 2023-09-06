'use client';

import { useState } from 'react';
import link from 'next/link';

import TransactionsStatement from '../hooks/TransactionsStatement';
import { FormatMoney } from '../hooks/Formatters';
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

function formatValues(header, value, row) {
	switch (header.key) {
		case 'approvedTotal':
			return FormatMoney(value);
			break;
		default:
			return value ? value : '-';
	}
}

export default function Members() {	
	const [ page, setPage ] = useState(1);
	const [ sort, setSort ] = useState({ column: null, direction: null });
	const { data, isLoading } = TransactionsStatement.GetMembersList({ page, sort });

	const [ showClaimsList, setShowClaimsList ] = useState(false);
	const [ showMemberDetail, setShowMemberDetail ] = useState(false);
	const [ showCoverageModal, setShowCoverageModal ] = useState(false);
	const [ memberId, setMemberId ] = useState(null);
	const [ coverageByMemberId, setCoverageByMemberId ] = useState(null);

	const onClickMemberDetail = (memberId) => {
		setShowMemberDetail(true);
		setMemberId(memberId);
	}

	const onClickMemberCoverage = (memberId) => {
		setShowCoverageModal(true);
		setMemberId(memberId);
	}

	const onClickViewClaims = (memberId) => {
		setShowClaimsList(true);
		setMemberId(memberId);
	}

	const onPageChange = (newPage) => {
		setShowMemberDetail(false);
		setShowClaimsList(false);
		setPage(newPage);
	}

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
							data={data?.items}
							pagination={true}
							page={page}
							totalPages={data?.totalPages}
							onPageChange={(newPage) => onPageChange(newPage)}
							sortEnabled={true}
							onSortChange={(sort) => setSort(sort)}
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
											<span className="hover:cursor-pointer" onClick={()=> onClickMemberDetail(row.memberId)}>Details</span>
										</Table.Cell>
										<Table.Cell className="!p-4">
											<span className="hover:cursor-pointer" onClick={()=> onClickMemberCoverage(row.memberId)}>View Coverage</span>
										</Table.Cell>
										<Table.Cell className="!p-4">
											<span className="hover:cursor-pointer" onClick={()=> onClickViewClaims(row.memberId)}>View Claims</span>
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
