import Modal from '../components/modal'
import TransactionsStatement from '../hooks/TransactionsStatement'

export default function MemberCoverageModal({memberId, showCoverageModal, setShowCoverageModal}){
	const { data, isLoading } = TransactionsStatement.getCoverageByMember(memberId);

	return(
		<Modal title='Member Coverage' showModal={showCoverageModal} setShowModal={setShowCoverageModal} showSaveButton={false}>
			{((!isLoading && data) ? (
				<>
					<h4 className="font-semibold mb-10">
						{data.firstName} {data.lastName}
					</h4>
					<div className='grid grid-cols-2'>
						<div>Start Date:</div>
						<div>September 9, 2022</div>
						<div>End Date:</div>
						<div>September 9, 2023</div>						
					</div>
				</>
			) : null)}
		</Modal>
	);
}	