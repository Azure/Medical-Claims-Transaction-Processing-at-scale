"use client";
import React, { useState, useEffect } from 'react'
import { Table, Pagination, Spinner } from 'flowbite-react';
import Link from 'next/link'
import TransactionsStatement from '../hooks/TransactionsStatement'
import MemberDetail from './memberDetail'
import MemberCoverageModal from './memberCoverageModal'

import ClaimList from '../member/claims/claimList'

export default function Members(){	
  const [ page, setPage ] = useState(1);
	const { data, isLoading } = TransactionsStatement.GetMembersList(page, 10);
	const [ showClaimsList, setShowClaimsList ] = useState(false);
	const [ showMemberDetail, setShowMemberDetail ] = useState(false);
	const [ showCoverageModal, setShowCoverageModal ] = useState(false);
	const [ memberId, setMemberId ] = useState(null);
	const [ coverageByMemberId, setCoverageByMemberId ] = useState(null);
	const [ showMembersTable, setShowMembersTable ] = useState(true);

	const cardClass = (isLoading)=>{
		let classList = 'card mb-10';
		if(isLoading) classList += ' h-full';
		return classList;
	}

	return(
		<>
			<div className={cardClass(isLoading)}>
				<div className="card-header">
					<h4 className="card-title">Members</h4>
				</div>
				<div className="card-body">
						{!isLoading ? (
							<div className="relative overflow-x-auto sm:rounded">
									<MembersTable data={data} {...{setShowMemberDetail, setShowClaimsList, setMemberId, setCoverageByMemberId, setShowCoverageModal, setShowMembersTable, page, setPage }} />
							</div>  
						) : 
							<div className='text-center mt-20'>
								<Spinner aria-label="Loading..." />
							</div>
						}
				</div>
			</div>

			{	showClaimsList ? (<ClaimList memberId={memberId}/>) : null }

			{	showMemberDetail ? (<MemberDetail memberId={memberId}/>) : null }

			{ showCoverageModal ? <MemberCoverageModal memberId={memberId} {...{showCoverageModal, setShowCoverageModal}} /> : null}
			
		</>
	);
}


function MembersTable({ data, setShowMemberDetail, setShowClaimsList, setMemberId, setCoverageByMemberId, setShowCoverageModal, setShowMembersTable, page, setPage }){
	const headers = [
		{ key: 'firstName', name: 'First Name'},
		{ key: 'lastName', name: 'Last Name'},
		{ key: 'state', name: 'State'},
		{ key: 'memberType', name: 'Member Type'},
		{ key: 'approvedCount', name: 'Approved Count'},
		{ key: 'approvedTotal', name: 'Approved Total'}
	];

	return(
		<>
			<Datatable headers={headers} {...{data, setShowMemberDetail, setShowCoverageModal, setShowClaimsList, setMemberId, setCoverageByMemberId, setShowMembersTable }}/>
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

const Datatable = ({ setShowMemberDetail, setShowCoverageModal, setShowClaimsList, setMemberId, setCoverageByMemberId, setShowMembersTable, headers = [], data = [] }) => {
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
            	<Link href='#' onClick={()=> onClickMemberDetail(row.memberId, setShowMemberDetail, setMemberId)}>Details</Link>
            </Table.Cell>
            <Table.Cell className="!p-4">
            	<Link href='#' onClick={()=> onClickMemberCoverage(row.memberId, setShowCoverageModal, setMemberId)}>View Coverage</Link>
            </Table.Cell>
           <Table.Cell className="!p-4">
				<Link href='#claimsList' onClick={()=> onClickViewClaims(row.memberId, setShowClaimsList, setMemberId, setShowMembersTable)}>View Claims</Link>
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

const onClickViewClaims = (memberId, setShowClaimsList, setMemberId, setShowMembersTable)=>{
	setShowClaimsList(true);
	setShowMembersTable(false);
	setMemberId(memberId);
}

function formatValues(headerKey, value, row){
	let money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

	switch(headerKey){
		case "ApprovedTotal":
			return money.format(value);
			break;
		case "FirstName":
			return `${row.firstName} ${row.lastName}`;
			break;
		default:
			return value ? value : '-';
	}	
}