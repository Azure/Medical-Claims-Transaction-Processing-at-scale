"use client";
import React, { useState, useEffect } from 'react'
import { Table, Pagination, Spinner } from 'flowbite-react';
import Link from 'next/link'
import TransactionsStatement from '../hooks/TransactionsStatement'
import MemberDetail from './memberDetail'
import MemberCoverageModal from './memberCoverageModal'

export default function Members(){	
  const [page, setPage] = useState(1);
	const { data, isLoading } = TransactionsStatement.getMembersList(page, 10);
	const [ showMemberDetail, setShowMemberDetail ] = useState(false);
	const [ showCoverageModal, setShowCoverageModal ] = useState(false);
	const [ memberId, setMemberId ] = useState(null);
	const [ coverageByMemberId, setCoverageByMemberId ] = useState(null);

	return(
		<>
			<div className="card mb-10">
				<div className="card-header">
					<h4 className="card-title">Members</h4>
				</div>
				<div className="card-body">
					<div className="relative overflow-x-auto sm:rounded">
						{!isLoading ? (
							<MembersTable data={data} {...{showCoverageModal, setShowCoverageModal, 
								setShowMemberDetail, setMemberId, setCoverageByMemberId, page, setPage }} />
						) : <Spinner aria-label="Loading..." /> }
					</div>  
				</div>
			</div>

			{	showMemberDetail ? (<MemberDetail memberId={memberId}/>) : null }

			{ showCoverageModal ? <MemberCoverageModal memberId={coverageByMemberId} {...{showCoverageModal, setShowCoverageModal, setCoverageByMemberId}} /> : null}
			
		</>
	);
}


function MembersTable({ data, setShowMemberDetail, showCoverageModal, setShowCoverageModal, setMemberId, setCoverageByMemberId, page, setPage }){
	const headers = [
		{ key: 'FirstName', name: 'First Name'},
		{ key: 'LastName', name: 'Last Name'},
		{ key: 'State', name: 'State'},
		{ key: 'MemberType', name: 'Member Type'},
		{ key: 'ApprovedCount', name: 'Approved Count'},
		{ key: 'ApprovedTotal', name: 'Approved Total'}
	];

	return(
		<>
			<Datatable headers={headers} {...{data, setShowMemberDetail, showCoverageModal, setShowCoverageModal, setMemberId, setCoverageByMemberId }}/>
      <Pagination
        className="p-6 self-center"
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
          //setContinuationToken(data.continuationToken);
        }}
        totalPages={100}
      />
		</>
	);
}

const Datatable = ({ setShowMemberDetail, setShowCoverageModal, setMemberId, setCoverageByMemberId, headers = [], data = [] }) => {
  return (
    <Table className="w-full" hoverable>
      <Table.Head>
        {headers.map((header) => (
          <Table.HeadCell key={header.key} className="!p-4">
            {header.name}
          </Table.HeadCell>
        ))}
        <Table.HeadCell className="!p-4"/>
        <Table.HeadCell className="!p-4"/>
         <Table.HeadCell className="!p-4"/>
      </Table.Head>
      <Table.Body className="divide-y">
        {data.map((row) => (
          <Table.Row key={row.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            {Object.values(headers).map((header, index) => (
              <Table.Cell key={`${row.id}-${index}`} className="!p-4">
                {formatValues(header.key, row[header.key], row)}
              </Table.Cell>
            ))}
            <Table.Cell className="!p-4">
            	<Link href='#' onClick={()=> onClickMemberDetail(row.MemberId, setShowMemberDetail, setMemberId)}>Details</Link>
            </Table.Cell>
            <Table.Cell className="!p-4">
            	<Link href='#' onClick={()=> onClickMemberCoverage(row.MemberId, setShowCoverageModal, setCoverageByMemberId)}>View Coverage</Link>
            </Table.Cell>
           <Table.Cell className="!p-4">
            	<Link href={`/member/claims/${row.MemberId}`}>View Claims</Link>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

const onClickMemberDetail = (memberId, setShowMemberDetail, setMemberId)=>{
	setShowMemberDetail(true);
	setMemberId(memberId);
}

const onClickMemberCoverage = (memberId, setShowCoverageModal, setMemberId)=>{
	setShowCoverageModal(true);
	setMemberId(memberId);
}

function formatValues(headerKey, value, row){
	let money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

	switch(headerKey){
		case "approvedTotal":
			return money.format(value);
			break;
		case "firstName":
			return `${row.firstName} ${row.lastName}`;
			break;
		default:
			return value ? value : '-';
	}	
}