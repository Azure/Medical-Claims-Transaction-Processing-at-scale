import TransactionsStatement from '../hooks/TransactionsStatement'
import { Spinner } from 'flowbite-react';

export default function MemberDetail({memberId}){
	const { data, error, isLoading } = TransactionsStatement.GetMember(memberId);

	return(
		!isLoading ? (
			<div className="card mt-10">
				<div className="card-header">
					<h4 className="card-title">Member Detail for {data.firstName} {data.lastName}</h4>
				</div>
				<div className="card-body">
					<div className="relative overflow-x-auto sm:rounded">
						<div className='grid grid-cols-2'>
							<div className='grid grid-cols-2'>
								<div className='px-4 font-bold gap-2'>Title:</div><div>{data.title}</div>
								<div className='px-4 font-bold gap-2'>First Name:</div><div>{data.firstName}</div>
								<div className='px-4 font-bold gap-2'>Last Name:</div><div>{data.lastName}</div>
								<div className='px-4 font-bold gap-2'>Member Type:</div><div>{data.type}</div>
								<div className='px-4 font-bold gap-2'>Email:</div><div>{data.email}</div>
								<div className='px-4 font-bold gap-2'>Phone Number:</div><div>{data.phoneNumber}</div>
							</div>
							<div className='grid grid-cols-2'>
								<div className='px-4 font-bold gap-2'>Address:</div><div>{data.address}</div>
								<div className='px-4 font-bold gap-2'>City:</div><div>{data.city}</div>
								<div className='px-4 font-bold gap-2'>State:</div><div>{data.state}</div>
								<div className='px-4 font-bold gap-2'>Country:</div><div>{data.country}</div>
								<div className='px-4 font-bold gap-2'>Approved Count:</div><div>{data.approvedCount}</div>
								<div className='px-4 font-bold gap-2'>Approved Total:</div><div>{data.approvedTotal}</div>
							</div>
						</div>
					</div>  
				</div>
			</div>
		) : 
			<div className='text-center mt-20'>
				<Spinner aria-label="Loading..." />
			</div>	
	);
}