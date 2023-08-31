'use client';

import { Tabs } from 'flowbite-react';
import ClaimsByAdjudicator from './ClaimsByAdjudicator';

const tabTheme = {
  base: 'flex flex-col',
  tablist: {
    tabitem: {
      base: 'flex items-center justify-center p-4 rounded-t-lg text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 focus:outline-none',
      styles: {
        default: {
          base: 'rounded-t-lg',
          active: {
            on: 'bg-gray-100',
            off: 'text-gray-500 hover:bg-gray-50 hover:text-gray-600'
          }
        }
      }
    }
  },
  tabpanel: ''
}

export default function Adjudicator() {
	return(
		<>
			<Tabs.Group theme={tabTheme} aria-label="Default tabs" style="default">
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