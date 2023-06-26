"use client";

import React, { useState, useEffect } from 'react'
import { Table, Spinner, Pagination } from 'flowbite-react';
import Link from 'next/link'
import Moment from 'moment'
import TransactionsStatement from '../../hooks/TransactionsStatement'
import { AcknowledgeButton, DenyClaimButton, ProposeClaimButton, ApproveClaimButton } from './ClaimActions'
import ClaimStatusMap from './ClaimStatusMap'

let money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function ClaimDetails({ claimId, requestClaims }){
	const { data, isLoading, mutate } = TransactionsStatement.GetClaimDetails(claimId);

	return((!isLoading && data) ? (
		<>
			<div className="card">
				<div className="card-header grid grid-cols-2">
					<h4 className="card-title">Claim Details</h4>
					<div className='text-right'><label>Filing Date: </label>{ Moment(data.FilingDate).format('MMMM DD, YYYY') }</div>
				</div>
				<div className="card-body">
					<div className="relative overflow-x-auto sm:rounded">
						<div className='grid grid-cols-2 w-9/12'>
							<div className='px-4 font-bold gap-2'>Claim Id:</div>
							<div className='float-left'>{data.ClaimId}</div>
							<div className='px-4 font-bold gap-2'>Claim Status:</div>
							<div>
								{ClaimStatusMap.CodeToDisplayName(data.ClaimStatus)} 
								<ClaimsActions claimStatus={data.ClaimStatus} claimId={data.ClaimId} {...{data, requestClaims, mutate}}/>
							</div>
							<div className='px-4 font-bold gap-2'>Payer Name:</div>
							<div>{data.PayerName ? data.PayerName : '-'}</div>
							<div className='px-4 font-bold gap-2'>Total Amount:</div>
							<div>{money.format(data.TotalAmount)}</div>
							<div className='px-4 font-bold gap-2'>Provider Name:</div>
							<div>{data.ProviderName}</div>
							<div className='px-4 font-bold gap-2'>Comment:</div>
							<div>{data.Comment}</div>
						</div>
						<div>
							<h4 className="card-title mt-10 mb-10">Line Items</h4>
							<LineItemsTable data={data.LineItems ? data.LineItems : []}/>
						</div>
					</div>
				</div>
			</div>
		</>
	) : <Spinner aria-label="Loading..." />);
}

function ClaimsActions({claimStatus, claimId, requestClaims }){
	let status = ClaimStatusMap.CodeToDisplayName(claimStatus);

	switch(status){
		case "Assigned":
			return (<AcknowledgeButton claimId={claimId} {...{requestClaims}} />);
			break;
		case "Acknowledged":
			return (
				<>
					<DenyClaimButton claimId={claimId} {...{requestClaims}}/>
					<ProposeClaimButton claimId={claimId} {...{requestClaims}}/>
				</>
			);
			break;
		case "ApprovalRequired":
			return (
				<>
					<DenyClaimButton claimId={claimId} {...{requestClaims}}/>
					<ApproveClaimButton claimId={claimId} {...{requestClaims}}/>
				</>
			);
			break;
		default:
			return(null);
			break;
	}
}

function LineItemsTable({ data }){
	const headers = [
		{ key: 'ProcedureCode', name: 'Procedure Code'},
		{ key: 'Description', name: 'Description'},
		{ key: 'ServiceDate', name: 'Service Date'},
		{ key: 'Amount', name: 'Amount'},
		{ key: 'Discount', name: 'Discount'},
	];

	return(
		<>
			<LineItemsDataTable {...{data, headers}}/>
		</>
	);
}

function LineItemsDataTable({headers, data}){
	return(
	    <Table className="w-full" hoverable>
	      <Table.Head>
	        {headers.map((header) => (
	          <Table.HeadCell key={header.key} className="!p-4">
	            {header.name}
	          </Table.HeadCell>
	        ))}
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
	            	<Link href='#' onClick={()=> setClaimId(row.ClaimId)}>Apply Discount</Link>
	            </Table.Cell>
	          </Table.Row>
	        ))}
	      </Table.Body>
	    </Table>
	);
}

function formatValues(headerKey, value){
	switch(headerKey){
		case "ServiceDate":
			return Moment(value).format('YYYY-MM-DD');
			break;
		case "Amount":
		case "Discount":
			return money.format(value);
			break;
		default:
			return value ? value : '-';
	}	
}