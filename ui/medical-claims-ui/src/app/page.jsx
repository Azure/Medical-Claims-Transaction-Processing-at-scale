'use client';

import { FaGear } from 'react-icons/fa6';
import TransactionsStatement from './hooks/TransactionsStatement';

export default function Home() {
	const { data, isLoading } = TransactionsStatement.GetBusinessRules();

	return (!isLoading &&
		<div className="container m-auto">
			<h1>Welcome to <b>Medical Claims Handling</b></h1>
			<p>This site is the interface for a medical claims management solution.
				Members have insurance coverage and submit claims to cover various procedures.
				Providers deliver services to the members and payers provide the insurance coverage 
				that pays providers for their services.</p>
			<p>Claims submitted are submitted in a stream and loaded into the backing database for review and approval.</p>
			<p>Business rules govern the automated or human approval of claims.</p>
			<p>An AI-powered co-pilot empowers agents with recommendations on how to process the claim.</p>

			<div className="card mt-10 shadow-md">
				<div className="card-header">
					<h4 className="card-title flex items-center">
						<FaGear className="inline mr-2" />
						<span>Business Rules</span>
					</h4>
				</div>
				<div className="card-body">
					<div className="flex justify-between overflow-x-auto sm:rounded flex-col md:flex-row">
						<div className="flex-1 p-6">
							<div className="flex justify-between">
								<h1>Auto-Approve Threshold</h1>
								<h1 className="font-bold">${data.autoApproveThreshold}</h1>
							</div>
							<p>Claim is automatically approved if the total dollar amount falls below this threshold.</p>
						</div>
						<div className="flex-1 p-6">
							<div className="flex justify-between">
								<h1>Require Manager Approval</h1>
								<h1 className="font-bold">${data.requireManagerApproval}</h1>
							</div>
							<p>If the adjudicator proposes a claim assigned to them and the difference in the total amount in the line items before and after applying discounts is greater than this amount, it must be approved by a manager.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

