
import react, { useState, useEffect } from 'react';
import TransactionsStatement, { UpdateClaim, AcknowledgeClaim } from '../../hooks/TransactionsStatement';
import Modal from '../../components/modal';

const delayTimeAcknowledge = 4000;
const delayTime = 2000;


export function AcknowledgeButton ({ claimId, requestClaims, lineItems, mutate, setChangeDetail }){
	const [ showModal, setShowModal ] = useState(false);
	const [ comment, setComment ] = useState('');
	const { trigger } = AcknowledgeClaim(claimId);

	const onSave = async ()=>{
		var resp = await trigger({claimId: claimId});	
		mutate();
		await sleep(delayTimeAcknowledge);
		setChangeDetail(true);
		setShowModal(false);
	}

	return(
		<>
			<button className='btn bg-gray-300 hover:bg-gray-100 ml-5' onClick={() => setShowModal(true)}>
				Acknowledge Claim Assignment
			</button>
			<Modal title='Claim Action Confirmation' {...{showModal, setShowModal, onSave}}>
				Are you sure to acknowledge this claim assignment?
				<br/>
				{claimId}
			</Modal>
		</>
	);
}

export function DenyClaimButton ({claimId, requestClaims, lineItems, setChangeDetail}){
	const [ showModal, setShowModal ] = useState(false);
	const [ comment, setComment ] = useState('');
	const { trigger } = UpdateClaim(claimId);

	const onClickButton = ()=>{
		setShowModal(true)
		setChangeDetail(true)
		setComment('')
	}

	const onSave = async ()=>{
		var resp = await trigger({ claimStatus: 'Denied', comment: comment, lineItems: lineItems});
		requestClaims.mutate();
		setShowModal(false);
	}

	return(
		<>
			<button className='btn bg-red-500 hover:bg-red-600 text-white mr-5 ml-5' 
				onClick={onClickButton}>
				Deny Claim
			</button>
			<Modal title='Claim Action Confirmation' {...{showModal, setShowModal, onSave}}>
				Are you sure to deny this claim?
				<br/>
				{claimId}
		
				<label htmlFor="comments" className='block text-gray-700 text-sm font-bold mb-2 mt-5'>Comments:</label>
				<textarea type="text" id="comments" name="comments" value={comment} onChange={(e)=> {setComment(event.target.value)} }
					className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
			</Modal>
		</>
	);
}

export function ProposeClaimButton ({claimId, requestClaims, lineItems, setChangeDetail}){
	const [ showModal, setShowModal ] = useState(false);
	const [ comment, setComment ] = useState('');
	const { trigger } = UpdateClaim(claimId);

	const onClickButton = ()=>{
		setShowModal(true)
		setChangeDetail(true)
		setComment('')
	}

	const onSave = async ()=>{
		var resp = await trigger({ claimStatus: 'Proposed', comment: comment, lineItems: lineItems});
		requestClaims.mutate(null);	
		setShowModal(false);
	}

	return(
		<>
			<button className='btn bg-gray-300 hover:bg-gray-100' 
				onClick={onClickButton}>
				Propose Claim
			</button>
			<Modal title='Claim Action Confirmation' {...{showModal, setShowModal, onSave}}>
				Are you sure to propose this claim?
				<br/>
				{claimId}
		
				<label htmlFor="comments" className='block text-gray-700 text-sm font-bold mb-2 mt-5'>Comments:</label>
				<textarea type="text" id="comments" name="comments" value={comment} onChange={(e)=> {setComment(event.target.value)} }
					className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
				
			</Modal>
		</>
	);
}

export function ApproveClaimButton ({claimId, requestClaims, lineItems, setChangeDetail}){
	const [ showModal, setShowModal ] = useState(false);
	const [ comment, setComment ] = useState('');
	const { trigger } = UpdateClaim(claimId);

	const onClickButton = ()=>{
		setShowModal(true)
		setChangeDetail(true)
		setComment('')
	}

	const onSave = async ()=>{
		var resp = await trigger({ claimStatus: 'Proposed', comment: comment, lineItems: lineItems});
		requestClaims.mutate(null);	
		setShowModal(false);
	}

	return(
		<>
			<button className='btn bg-green-500 hover:bg-green-600 text-white' 
				onClick={onClickButton}>
				Approve Claim
			</button>
			<Modal title='Claim Action Confirmation' {...{showModal, setShowModal, onSave}}>
				Are you sure to approve this claim?
				<br/>
				{claimId}
		
				<label htmlFor="comments" className='block text-gray-700 text-sm font-bold mb-2 mt-5'>Comments:</label>
				<textarea type="text" id="comments" name="comments" value={comment} onChange={(e)=> {setComment(event.target.value)} }
					className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
				
			</Modal>
		</>
	);
}

const sleep = (time) => {
	return new Promise((resolve)=>setTimeout(resolve,time))
}
