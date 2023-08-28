'use client';

import { Tabs } from 'flowbite-react';
import ClaimsByAdjudicator from './ClaimsByAdjudicator';
import './style.css';


export default function Adjudicator() {
	return(
		<>
			<h1 className="mb-4">Claims to Assigned to Adjudicator</h1>
			<Tabs.Group id="claimsAdjudicatorTabs" aria-label="Default tabs" style="default">
				<Tabs.Item active title="Non-Manager">
					<ClaimsByAdjudicator adjudicatorId="df166300-5a78-3502-a46a-832842197811" isManager={false}/>
				</Tabs.Item>
					<Tabs.Item title="Manager">
					<ClaimsByAdjudicator adjudicatorId="a735bf55-83e9-331a-899d-a82a60b9f60c" isManager={true}/>
				</Tabs.Item>
			</Tabs.Group>
		</>
	);
}