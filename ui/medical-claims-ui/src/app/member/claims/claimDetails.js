import React, { useState, useEffect, useRef } from 'react'
import { Table, Spinner, Pagination, Button, Textarea } from 'flowbite-react';
import Link from 'next/link'
import Moment from 'moment'
import TransactionsStatement from '../../hooks/TransactionsStatement'
import { AcknowledgeButton, DenyClaimButton, ProposeClaimButton, ApproveClaimButton } from './ClaimActions'
import { SparklesIcon } from '@heroicons/react/24/outline';
import { Modal } from 'flowbite-react';

const FormModal = ({ children, header, setOpenModal, openModal }) => {
  return (
    <Modal show={openModal} size="xl" popup onClose={() => setOpenModal(false)}>
      <Modal.Header className="items-center">{header}</Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

const RecommendActionForm = ({ claimId, setOpenModal }) => {
	const ref = useRef(null);
	const [form, setForm] = useState({
	  claimId
	});
  
	const { trigger } = TransactionsStatement.GetClaimRecommendation(claimId);
	const [isLoading, setIsLoading] = useState(false);
	const onClickCancel = () => {
	  setForm({ claimId: ''});
	  ref.current.value = '';
	  setIsLoading(false);
	  setOpenModal(false);
	};
  
	const onSubmit = async () => {
	  setIsLoading(true);
	  const response = await trigger(form);
	  console.log(response);
	  ref.current.value = response;
	  setIsLoading(false);
	};
  
	return (
	  <div className="space-y-6">
		<div className="mb-4">
		  <div className="mb-2 block">
			<Textarea ref={ref} id="results" name="results" />
		  </div>
		</div>
		<div className="w-full flex justify-between pt-4">
		  <Button color="light" onClick={onClickCancel}>
			Cancel
		  </Button>
		  <Button color="dark" onClick={onSubmit}>
			{isLoading ? <Spinner color="white" size="md" /> : 'Submit'}
		  </Button>
		</div>
	  </div>
	);
  };

let money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function ClaimDetails({ claimId, requestClaims }){
	const { data, isLoading, mutate } = TransactionsStatement.GetClaimDetails(claimId);

	const ref = useRef(null);
	const [isRecModalOpen, setIsRecModalOpen] = useState(false);
	const onClickRecommend = () => setIsRecModalOpen(true);

	const recModalHeader = <div className="text-xl p-4">Recommendation</div>;

	return((!isLoading && data) ? (
		<>
			<div className="card">
				<div className="card-header grid grid-cols-2">
					<h4 className="card-title">Claim Details</h4>
					<div className='text-right'><label>Filing Date: </label>{ Moment(data.FilingDate).format('MMMM DD, YYYY') }</div>
					<div className="justify-end">
						<Button color="dark" className="p-0" onClick={onClickRecommend}>
							<SparklesIcon className="h-6 w-6 text-gray-500 mr-3 text-white" />
							<h4>Make Recommendation</h4>
						</Button>
					</div>
				</div>
				<div className="card-body">
					<div className="relative overflow-x-auto sm:rounded">
						<div className='grid grid-cols-2 w-9/12'>
							<div className='px-4 font-bold gap-2'>Claim Id:</div>
							<div className='float-left'>{data.ClaimId}</div>
							<div className='px-4 font-bold gap-2'>Claim Status:</div>
							<div>
								{/* {data.ClaimStatus}  */}
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
			<FormModal header={recModalHeader} openModal={isRecModalOpen}>
			  <RecommendActionForm claimId={claimId} setOpenModal={setIsRecModalOpen} />
			</FormModal>
		</>
	) : <Spinner aria-label="Loading..." />);
}

function ClaimsActions({claimStatus, claimId, requestClaims }){
	switch(claimStatus){
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