import React, { useState, useEffect } from 'react'
import { Table } from 'flowbite-react';
import Link from 'next/link'
import Moment from 'moment'
import TransactionsStatement from '../../../hooks/TransactionsStatement'

let money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function ClaimHistory({ claimId }){
	const claimRequest = TransactionsStatement.getClaimDetails(claimId);
	const historyRequest = TransactionsStatement.getClaimHistory(claimId);

	return((!claimRequest.isLoading && claimRequest.data) ? (
		<>
			<div className="card">
				<div className="card-header grid grid-cols-2">
					<h4 className="card-title">Claim Details</h4>
					<div className='text-right'><label>Filing Date: </label>{ Moment(claimRequest.data.FilingDate).format('MMMM DD, YYYY') }</div>
				</div>
				<div className="card-body">
					<div className="relative overflow-x-auto sm:rounded">
						<div className='grid grid-cols-2'>
							<div>
								<div className='grid grid-cols-2 w-9/12'>
									<div className='px-4 font-bold gap-2'>Claim Id:</div>
									<div className='float-left'>{claimRequest.data.ClaimId}</div>
									<div className='px-4 font-bold gap-2'>Claim Status:</div>
									<div>{claimRequest.data.ClaimStatus}</div>
									<div className='px-4 font-bold gap-2'>Payer Name:</div>
									<div>{claimRequest.data.PayerName ? data.header.PayerName : '-'}</div>
									<div className='px-4 font-bold gap-2'>Total Amount:</div>
									<div>{money.format(claimRequest.data.TotalAmount)}</div>
									<div className='px-4 font-bold gap-2'>Provider Name:</div>
									<div>{claimRequest.data.ProviderName}</div>
									<div className='px-4 font-bold gap-2'>Comment:</div>
									<div>{claimRequest.data.Comment}</div>
								</div>
							</div>
							<div className='align-text-top text-right'>
								<div>Modified By: {claimRequest.data.ModifiedBy}</div>
								<div>Modified On: {Moment(claimRequest.data.ModifiedOn).format('MMMM DD, YYYY hh:mm a')}</div>
							</div>
						</div>
						<div>
							<h4 className="card-title mt-10 mb-10">Line Items</h4>
							<LineItemsTable data={claimRequest.data.LineItems ? claimRequest.data.LineItems : []}/>
						</div>
					</div>
				</div>
			</div>
			{(!historyRequest.isLoading && historyRequest.data) ? (
				historyRequest.data.History.map((item)=>{
					return(<HistoryItem data={item}/>)
				})
			) : null}
		</>
	) : null);
}

function HistoryItem({data}){
	return(
		<div className="card bg-gray-200 mb-10 mt-10">
			<div className="card-body">
				<div className="relative overflow-x-auto sm:rounded">
					<div className='grid grid-cols-2'>
						<div>
							<div className='grid grid-cols-2 w-9/12'>
								<div className='px-4 font-bold gap-2'>Claim Id:</div>
								<div className='float-left'>{data.ClaimId}</div>
								<div className='px-4 font-bold gap-2'>Claim Status:</div>
								<div>{data.ClaimStatus}</div>
								<div className='px-4 font-bold gap-2'>Payer Name:</div>
								<div>{data.PayerName ? data.PayerName : '-'}</div>
								<div className='px-4 font-bold gap-2'>Total Amount:</div>
								<div>{money.format(data.TotalAmount)}</div>
								<div className='px-4 font-bold gap-2'>Provider Name:</div>
								<div>{data.ProviderName}</div>
								<div className='px-4 font-bold gap-2'>Comment:</div>
								<div>{data.Comment}</div>
							</div>							
						</div>
						<div className='align-text-top text-right'>
							<div>Modified By: {data.ModifiedBy}</div>
							<div>Modified On: {Moment(data.ModifiedOn).format('MMMM DD, YYYY hh:mm a')}</div>
						</div>
					</div>
					<div>
						<h4 className="card-title mt-10 mb-10">Line Items</h4>
						<LineItemsTable data={data.LineItems ? data.LineItems : []}/>
					</div>
				</div>
			</div>
		</div>
	);
}

function LineItemsTable({ data }){
	const headers = [
		{ key: 'ProcedureCode', name: 'Procedure Code'},
		{ key: 'Description', name: 'Description'},
		{ key: 'ServiceDate', name: 'Service Date'},
		{ key: 'Amount', name: 'Amount'},
		{ key: 'Discount', name: 'Discount'},
	];

	return(<LineItemsDataTable {...{data, headers}}/>);
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
	            	<Link href='#' onClick={()=> setClaimId(row.claimId)}>Apply Discount</Link>
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