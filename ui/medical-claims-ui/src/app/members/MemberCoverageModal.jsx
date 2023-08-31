
import moment from 'moment';
import TransactionsStatement from '../hooks/TransactionsStatement';
import Modal from '../components/Modal';


export default function MemberCoverageModal({ memberId, showCoverageModal, setShowCoverageModal }) {
	const memberRequest = TransactionsStatement.GetMember(memberId);
	const coverageRequest = TransactionsStatement.GetCoverageByMember(memberId);

	return(
		<Modal title='Member Coverage' showModal={showCoverageModal} setShowModal={setShowCoverageModal} showSaveButton={false}>
			{((!memberRequest.isLoading && memberRequest.data) ? (
				<>
					<h4 className="font-semibold mb-10">
						{memberRequest.data.firstName} {memberRequest.data.lastName}
					</h4>
					{!coverageRequest.isLoading ? (
						<div className='grid grid-cols-2'>
							<div>Start Date:</div>
							<div>{ moment(coverageRequest.data.startDate).format('MMM DD, YYYY') }</div>
							<div>End Date:</div>
							<div>{ moment(coverageRequest.data.endDate).format('MMM DD, YYYY') }</div>						
						</div>
					) : null}
				</>
			) : null)}
		</Modal>
	);
}	