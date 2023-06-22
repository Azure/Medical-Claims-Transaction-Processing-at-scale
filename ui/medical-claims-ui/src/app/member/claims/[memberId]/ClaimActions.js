import React, { useState } from 'react'
import TransactionsStatement, { updateClaim, acknowledgeClaim } from '../../../hooks/TransactionsStatement'
import Modal from '../../../components/modal'

export function AcknowledgeButton ({ claimId, requestClaims, mutate }){
	const [ showModal, setShowModal ] = useState(false);
	const [ comment, setComment ] = useState('');
	const { trigger } = acknowledgeClaim(claimId);

	const onSave = async ()=>{
		var resp = await trigger({claimId: claimId});	
		mutate();
		requestClaims.mutate();
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

export function DenyClaimButton ({claimId, requestClaims, mutate}){
	const [ showModal, setShowModal ] = useState(false);
	const [ comment, setComment ] = useState('');
	const { trigger } = updateClaim(claimId);

	const onClickButton = ()=>{
		setShowModal(true)
		setComment('')
	}

	const onSave = async ()=>{
		var resp = await trigger({ claimStatus: 'Denied', comment: comment});
		mutate();
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
		
				<label for="comments" className='block text-gray-700 text-sm font-bold mb-2 mt-5'>Comments:</label>
				<textarea type="text" id="comments" name="comments" value={comment} onChange={(e)=> {setComment(event.target.value)} }
					className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
			</Modal>
		</>
	);
}

export function ProposeClaimButton ({claimId, requestClaims}){
	const [ showModal, setShowModal ] = useState(false);
	const [ comment, setComment ] = useState('');
	const { trigger } = updateClaim(claimId);

	const onClickButton = ()=>{
		setShowModal(true)
		setComment('')
	}

	const onSave = async ()=>{
		var resp = await trigger({ claimStatus: 'Proposed', comment: comment});
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
		
				<label for="comments" className='block text-gray-700 text-sm font-bold mb-2 mt-5'>Comments:</label>
				<textarea type="text" id="comments" name="comments" value={comment} onChange={(e)=> {setComment(event.target.value)} }
					className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
				
			</Modal>
		</>
	);
}

export function ApproveClaimButton ({claimId, requestClaims}){
	const [ showModal, setShowModal ] = useState(false);
	const [ comment, setComment ] = useState('');
	const { trigger } = updateClaim(claimId);

	const onClickButton = ()=>{
		setShowModal(true)
		setComment('')
	}

	const onSave = async ()=>{
		var resp = await trigger({ claimStatus: 'Approved', comment: comment});
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
		
				<label for="comments" className='block text-gray-700 text-sm font-bold mb-2 mt-5'>Comments:</label>
				<textarea type="text" id="comments" name="comments" value={comment} onChange={(e)=> {setComment(event.target.value)} }
					className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
				
			</Modal>
		</>
	);
}