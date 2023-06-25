import TransactionsStatement from '../hooks/TransactionsStatement'
import { Spinner } from 'flowbite-react';

export default function MemberDetail({memberId}){
	const { data, error, isLoading } = TransactionsStatement.GetMember(memberId);

	return(
		!isLoading ? (
			<div className="card">
				<div className="card-header">
					<h4 className="card-title">Member Detail</h4>
				</div>
				<div className="card-body">
					<div className="relative overflow-x-auto sm:rounded">
						<div className='grid grid-cols-2'>
							<div className='grid grid-cols-2'>
								<div className='px-4 font-bold gap-2'>Title:</div><div>{data.Title}</div>
								<div className='px-4 font-bold gap-2'>First Name:</div><div>{data.FirstName}</div>
								<div className='px-4 font-bold gap-2'>Last Name:</div><div>{data.LastName}</div>
								<div className='px-4 font-bold gap-2'>Member Type:</div><div>{data.Type}</div>
								<div className='px-4 font-bold gap-2'>Email:</div><div>{data.Email}</div>
								<div className='px-4 font-bold gap-2'>Phone Number:</div><div>{data.PhoneNumber}</div>
							</div>
							<div className='grid grid-cols-2'>
								<div className='px-4 font-bold gap-2'>Address:</div><div>{data.Address}</div>
								<div className='px-4 font-bold gap-2'>City:</div><div>{data.City}</div>
								<div className='px-4 font-bold gap-2'>State:</div><div>{data.State}</div>
								<div className='px-4 font-bold gap-2'>Country:</div><div>{data.Country}</div>
								<div className='px-4 font-bold gap-2'>Approved Count:</div><div>{data.ApprovedCount}</div>
								<div className='px-4 font-bold gap-2'>Approved Total:</div><div>{data.ApprovedTotal}</div>
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