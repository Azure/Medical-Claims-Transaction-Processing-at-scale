import { useState, useRef } from 'react';
import { Button, Label, Spinner, Textarea, TextInput } from 'flowbite-react';

import TransactionsStatement from '~/hooks/TransactionsStatement';


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

		if (response.status === 200) {
			ref.current.value = response.data;
			console.log(response.data);
			setIsLoading(false);
		} else {
			setIsLoading(false);
		}
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

export default RecommendActionForm;
