"use client";

import { useParams  } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import TransactionsStatement from '../../../hooks/TransactionsStatement'
import { Table } from 'flowbite-react';
import Link from 'next/link'
import Moment from 'moment'
import ClaimDetails from './claimDetails'

export default function page(){
	const params = useParams();

	const requestMember = TransactionsStatement.getMember(params.memberId);
	const requestClaims = TransactionsStatement.getClaimsByMemberId(params.memberId, 0, 5);

	const [claimId, setClaimId] = useState(null);

	return(
		<>
			{(!requestMember.isLoading && requestMember.data) ? (
				<h3 className='text-3xl'>
					Member Claims for {requestMember.data.firstName} {requestMember.data.lastName}
				</h3>
			) : null}

			{ /*Claims List*/ }
			<div className="card mb-10 mt-10">
				<div className="card-header">
					<h4 className="card-title">Claims</h4>
				</div>
				<div className="card-body">
					<div className="relative overflow-x-auto sm:rounded">
						{ (!requestClaims.isLoading && requestClaims.data) ? (
							<ClaimsTable data={requestClaims.data} {...{claimId, setClaimId}}/>
						) : null}
					</div>
				</div>
			</div>

			{ /*Claim Detail*/ }
			<ClaimDetails {...{claimId}}/>
		</>
	);
}

function ClaimsTable({ data, claimId, setClaimId }){
	const headers = [
		{ key: 'filingDate', name: 'Filing Date'},
		{ key: 'claimStatus', name: 'Claim Status'},
		{ key: 'payerName', name: 'Payer'},
		{ key: 'lastAdjudicatedDate', name: 'Last Adjucated Date'},
		{ key: 'lastAmount', name: 'Last Amout'},
		{ key: 'totalAmount', name: 'Total Amount'}
	];

	return(
		<Datatable headers={headers} {...{data, claimId, setClaimId }}/>
	);
}

const Datatable = ({ claimId, setClaimId, headers = [], data = [] }) => {
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
      </Table.Head>
      <Table.Body className="divide-y">
        {data.map((row) => (
          <Table.Row key={row.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            {Object.values(headers).map((header, index) => (
              <Table.Cell key={`${row.id}-${index}`} className="!p-4">
                { formatValues(header.key, row[header.key])}
              </Table.Cell>
            ))}
            <Table.Cell className="!p-4">
            	<Link href='#' onClick={()=> setClaimId(row.claimId)}>Details</Link>
            </Table.Cell>
           <Table.Cell className="!p-4">
            	<Link href={`/member/claims/${row.memberId}`}>View History</Link>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};


function formatValues(headerKey, value){
	let money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

	switch(headerKey){
		case "filingDate":
			return Moment(value).format('YYYY-MM-DD');
			break;
		case "totalAmount":
			return money.format(value);
			break;
		default:
			return value ? value : '-';
	}	
}