import { useParams  } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import TransactionsStatement from '../../hooks/TransactionsStatement'
import { Table, Pagination, Spinner } from 'flowbite-react';
import Link from 'next/link'
import Moment from 'moment'
import ClaimDetails from './claimDetails'
import ClaimHistory from './claimHistory'

export default function ClaimList({ memberId }){
	const params = useParams();
	const [page, setPage] = useState(1);

	const requestMember = TransactionsStatement.GetMember(memberId);
	const requestClaims = TransactionsStatement.GetClaimsByMemberId(memberId, page, 5);

	const [claimId, setClaimId] = useState(null);
	const [ showClaimDetail, setShowClaimDetail ] = useState(false);
	const [ showHistory, setShowHistory ] = useState(false);

	const cardClass = (isLoading)=>{
		let classList = 'card mb-10';
		if(isLoading) classList += ' h-full';
		return classList;
	}

	return(
		<>
			{(!requestMember.isLoading && requestMember.data) ? (
				<h3 className='text-2xl mb-10'>
					Member Claims for {requestMember.data.firstName} {requestMember.data.lastName}
				</h3>
			) : null}
			{ /*Claims List*/ }
			<div className={cardClass(requestClaims.isLoading)}>
				<div className="card-header">
					<h4 className="card-title">Claims</h4>
				</div>
				<div className="card-body">
						{ (!requestClaims.isLoading && requestClaims.data) ? (
							<div className="relative overflow-x-auto sm:rounded">
									<ClaimsTable data={requestClaims.data} {...{claimId, setClaimId, setShowClaimDetail, setShowHistory, page, setPage }}/>
							</div>
						) : 
							<div className='text-center mt-20'>
								<Spinner aria-label="Loading..." />
							</div>
						}
				</div>
			</div>

			{ /*Claim Detail*/ }
			{showClaimDetail ? (
				<ClaimDetails {...{claimId, requestClaims}}/>
			) : null}		

			{ /*Claim History*/ }
			{showHistory ? (
				<ClaimHistory {...{claimId}}/>
			) : null}	

		</>
	);
}

function ClaimsTable({ data, claimId, setClaimId, setShowClaimDetail, setShowHistory, page, setPage }){
	const headers = [
		{ key: 'filingDate', name: 'Filing Date'},
		{ key: 'claimStatus', name: 'Claim Status'},
		{ key: 'payerName', name: 'Payer'},
		{ key: 'lastAdjudicatedDate', name: 'Last Adjucated Date'},
		{ key: 'lastAmount', name: 'Last Amout'},
		{ key: 'totalAmount', name: 'Total Amount'}
	];

	return(
		<>
			<Datatable headers={headers} {...{data, claimId, setClaimId, setShowClaimDetail, setShowHistory }}/>
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

const Datatable = ({ claimId, setClaimId, setShowClaimDetail, setShowHistory, headers = [], data = [] }) => {
	const viewDetails = (claimId)=> {
		setClaimId(claimId);
		setShowClaimDetail(true);
		setShowHistory(false);
	}

	const viewHistory = (claimId)=> {
		setClaimId(claimId);
		setShowHistory(true);
		setShowClaimDetail(false);
	}

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
            	<Link href='#' onClick={()=> viewDetails(row.claimId)}>Details</Link>
            </Table.Cell>
           <Table.Cell className="!p-4">
            	<Link href='#' onClick={()=> viewHistory(row.claimId)}>View History</Link>
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
		case "lastAdjudicatedDate":
			return value ? Moment(value).format('YYYY-MM-DD hh:mm a') : '-';
			break;
		case "totalAmount":
			return money.format(value);
			break;
		default:
			return value ? value : '-';
	}	
}