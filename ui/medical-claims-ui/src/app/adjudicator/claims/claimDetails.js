"use client";

import React, { useState, useEffect, useRef } from 'react'
import { Table, Spinner, Pagination, Modal, Textarea, Button } from 'flowbite-react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link'
import Moment from 'moment'
import TransactionsStatement from '../../hooks/TransactionsStatement'
import { AcknowledgeButton, DenyClaimButton, ProposeClaimButton, ApproveClaimButton } from './ClaimActions'

let money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function ClaimDetails({ claimId, requestClaims, isManager, setChangeDetail }){
	const { data, isLoading, mutate } = TransactionsStatement.GetClaimDetails(claimId);

	const [isRecModalOpen, setIsRecModalOpen] = useState('');
	const onClickRecommend = () => setIsRecModalOpen(true);
	const recModalHeader = <div className="text-xl p-4">Recommendation</div>;

	const [ lineItems, setLineItems ] = useState([]);

	useEffect(()=>{
		setLineItems(data ? data.lineItems : []);
	}, [data]);

	return((!isLoading && data) ? (
		<>
			<div className="card">
				<div className="card-header grid grid-cols-2">
					<h4 className="card-title">Claim Details</h4>
					<div className='text-right'><label>Filing Date: </label>{ Moment(data.filingDate).format('MMMM DD, YYYY') }</div>
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
							<div className='float-left'>{data.claimId}</div>
							<div className='px-4 font-bold gap-2'>Member Id:</div>
							<div className='float-left'>{data.memberId}</div>
							<div className='px-4 font-bold gap-2'>Claim Status:</div>
							<div>
								{ data.claimStatus } 
								<ClaimsActions claimStatus={data.claimStatus} claimId={data.claimId} {...{data, requestClaims, lineItems, mutate, setChangeDetail}}/>
							</div>
							<div className='px-4 font-bold gap-2'>Payer Name:</div>
							<div>{data.PayerName ? data.payerName : '-'}</div>
							<div className='px-4 font-bold gap-2'>Total Amount:</div>
							<div>{money.format(data.totalAmount)}</div>
							<div className='px-4 font-bold gap-2'>Provider Name:</div>
							<div>{data.providerName}</div>
							<div className='px-4 font-bold gap-2'>Comment:</div>
							<div>{data.comment}</div>
						</div>
						<div>
							<h4 className="card-title mt-10 mb-10">Line Items</h4>
							<LineItemsTable data={data.lineItems ? data.lineItems : []} 
							isManager={isManager} setLineItems={setLineItems} claimStatus={data.claimStatus}/>
						</div>
					</div>
				</div>
			</div>
			<FormModal header={recModalHeader} openModal={isRecModalOpen} setOpenModal={setIsRecModalOpen} >
			  <RecommendActionForm claimId={claimId} setOpenModal={setIsRecModalOpen} openModal={isRecModalOpen} />
			</FormModal>
		</>
	) : <Spinner aria-label="Loading..." />);
}

const FormModal = ({ children, header, setOpenModal, openModal }) => {
  return (
    <Modal show={openModal} size="xxl" popup onClose={() => setOpenModal(false)} 
    	className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
      <Modal.Header className="items-center">{header}</Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

const RecommendActionForm = ({ claimId, setOpenModal, openModal }) => {
	const ref = useRef(null);
	const [ recommendation, setRecommendation ] = useState('');

	const [form, setForm] = useState({
	  claimId
	});

	useEffect(()=>{
		setRecommendation('');
	}, [openModal]);
  

	const {trigger} = TransactionsStatement.GetClaimRecommendation(claimId);

	const [isLoading, setIsLoading] = useState(false);
	const onClickCancel = () => {
	  setForm({ claimId: ''});
	  //ref.current.value = '';
	  setRecommendation('');
	  setIsLoading(false);
	  setOpenModal(false);
	};
  
	const onSubmit = async () => {		
	  setIsLoading(true);
	  const response = await trigger({});
	  console.log(response.trim());
	  setRecommendation(response.trim());
	  setIsLoading(false);
	};
 
	return (
	  <div className="space-y-6">
		<div className="mb-4">
		  <div className="mb-2 block">
			<Textarea id="results" name="results" value={recommendation} className='h-20'/>
		  </div>
		</div>
		<div className="w-full flex justify-between pt-4">
		  <Button color="light" onClick={onClickCancel}>
			Cancel
		  </Button>
		  <Button color="dark" onClick={()=>{ onSubmit() }}>
			{isLoading ? <Spinner color="white" size="md" /> : 'Submit'}
		  </Button>
		</div>
	  </div>
	);
  };

function ClaimsActions({claimStatus, claimId, requestClaims, lineItems, mutate, setChangeDetail }){
	switch(claimStatus){
		case "Assigned":
			return (<AcknowledgeButton claimId={claimId} {...{requestClaims, lineItems, mutate, setChangeDetail}} />);
			break;
		case "Acknowledged":
			return (
				<>
					<DenyClaimButton claimId={claimId} {...{requestClaims, lineItems,setChangeDetail}}/>
					<ProposeClaimButton claimId={claimId} {...{requestClaims, lineItems,setChangeDetail}}/>
				</>
			);
			break;
		case "ApprovalRequired":
			return (
				<>
					<DenyClaimButton claimId={claimId} {...{requestClaims, lineItems, setChangeDetail}}/>
					<ApproveClaimButton claimId={claimId} {...{requestClaims, lineItems, setChangeDetail}}/>
				</>
			);
			break;
		default:
			return(null);
			break;
	}
}

function LineItemsTable({ data, setLineItems, isManager, claimStatus }){
	const headers = [
		{ key: 'lineItemNo', name: 'Line Item #'},
		{ key: 'procedureCode', name: 'Procedure Code'},
		{ key: 'description', name: 'Description'},
		{ key: 'serviceDate', name: 'Service Date'},
		{ key: 'amount', name: 'Amount'},
		{ key: 'discount', name: 'Discount'},
	];

	return(
		<>
			<LineItemsDataTable {...{data, headers, setLineItems, isManager, claimStatus}}/>
		</>
	);
}

function LineItemsDataTable({headers, data, setLineItems, isManager, claimStatus}){
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
		            	 { ableApplyDiscount(claimStatus) ? 
		            	 	<ApplyDiscount {...{row, data, setLineItems, isManager}}/>
		            	 	: null }
		            </Table.Cell>
   
	          </Table.Row>
	        ))}
	      </Table.Body>
	    </Table>
	);
}

const ableApplyDiscount = (claimStatus) => {
	if (claimStatus.toLowerCase() == 'denied' || claimStatus.toLowerCase() == 'approved') 
		return false;
	else
		return true;
}

const ApplyDiscount = ({row, data, setLineItems}) => {
	const [ openModal, setOpenModal ] = useState(false);
	const [ discountValue, setDiscountValue ] = useState(0);
	const dicountRef = useRef(0);

	const onSave = ()=>{
    var list = [...data];
    var lineItem = list.filter(x => x.lineItemNo == row.lineItemNo)[0];
    lineItem.discount = parseFloat(dicountRef.current);
    setLineItems(list);
    setOpenModal(false);
	}

	const onChange = (e) => {
		dicountRef.current = e.target.value;
	}

	return(
		<>
			<Link href='#' onClick={()=> setOpenModal(true)}>Apply Discount</Link>
	    <Modal show={openModal} size="xl" popup onClose={() => setOpenModal(false)} 
	    	className='justify-center items-center flex overflow-x-hidden overflow-y-auto 
	    	fixed inset-0 z-50 outline-none focus:outline-none'
    	>
	      <Modal.Header className="items-center">Apply Discount</Modal.Header>
	      <Modal.Body className='mt-10'>
					<input type="number" ref={dicountRef} onChange={(e)=>onChange(e)}
						className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
	      </Modal.Body>
	      <Modal.Footer>
  				<button
						className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
						type="button" onClick={onSave}>
						Apply
					</button>
	      </Modal.Footer>
	    </Modal>
		</>
	);
}

function formatValues(headerKey, value){
	switch(headerKey){
		case "serviceDate":
			return Moment(value).format('YYYY-MM-DD');
			break;
		case "amount":
		case "discount":
			return money.format(value);
			break;
		default:
			return value ? value : '-';
	}	
}