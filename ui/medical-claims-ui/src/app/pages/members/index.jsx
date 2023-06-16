"use client";
import React, { useState, useEffect } from 'react'
import { Table } from 'flowbite-react';
import TransactionsStatement from '../../hooks/TransactionsStatement'

export default function Members(){	
	const { data, isLoading } = TransactionsStatement.getMembersList('3aa2486e-ddbf-6927-4956-79d306dbd66b');

	return(
	    <div className="container mx-auto px-2 min-h-[calc(100vh-138px)]  relative pb-14 ">         
	        <div className="grid md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-4 mb-4">
	            <div className="sm:col-span-12  md:col-span-12 lg:col-span-12 xl:col-span-12 ">

					<div className="card h-full">
						<div className="card-header">
							<h4 className="h-10 card-title">Members</h4>
						</div>
						<div className="card-body">
							<div className="relative overflow-x-auto sm:rounded">
								<MembersTable data={data}/>
							</div>  
						</div>
					</div> 

				</div>
			</div>
		</div>
	);
}

function MembersTable(props){
	const { data } = props;

	console.log(data);

	const headers = [
		{ key: 'firstName', name: 'name'},
		{ key: 'state', name: 'State/Province'},
		{ key: 'country', name: 'Country'},
		{ key: 'memberType', name: 'Member Type'},
		{ key: 'approvedCount', name: 'Approved Count'},
		{ key: 'approvedTotal', name: 'Approved Total'},
		{ key: 'view-coverage', name: ''},
		{ key: 'view-claims', name: ''}
	];

	return(
		<Datatable headers={headers} data={data} />
	);

	return(
		<>
		<table className="w-full text-sm text-left text-gray-500">
			<thead className="text-xs text-gray-700 uppercase bg-gray-50">
				<tr>
					<th scope="col" className="px-6 py-3">
						Name
					</th>
					<th scope="col" className="px-6 py-3">
						State/Province
					</th>
					<th scope="col" className="px-6 py-3">
						Country
					</th>
					<th scope="col" className="px-6 py-3">
						Member Type
					</th>
					<th scope="col" className="px-6 py-3">
						Approved Count
					</th>
					<th scope="col" className="px-6 py-3">
						Approved Total
					</th>
					<th scope="col" className="px-6 py-3">	                            
					</th>
					<th scope="col" className="px-6 py-3">	                            
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					className="bg-white border-b hover:bg-gray-50">
					<th scope="row" className="px-6 py-4 font-medium text-gray-900">
						Jerry Mattedi
					</th>
					<td className="px-6 py-4">
						New York
					</td>
					<td className="px-6 py-4">
						United States
					</td>
					<td className="px-6 py-4">
						Self
					</td>
					<td className="px-6 py-4">
						10
					</td>
					<td className="px-6 py-4">
						$35,000
					</td>
					<td className="px-6 py-4 text-right">
						<a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View Coverage</a>
					</td>
					<td className="px-6 py-4 text-right">
						<a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View Claims</a>
					</td>
				</tr>
				<tr
					className="bg-white border-b hover:bg-gray-50">
					<th scope="row" className="px-6 py-4 font-medium text-gray-900">
						Jerry Mattedi
					</th>
					<td className="px-6 py-4">
						New York
					</td>
					<td className="px-6 py-4">
						United States
					</td>
					<td className="px-6 py-4">
						Self
					</td>
					<td className="px-6 py-4">
						10
					</td>
					<td className="px-6 py-4">
						$35,000
					</td>
					<td className="px-6 py-4 text-right">
						<a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View Coverage</a>
					</td>
					<td className="px-6 py-4 text-right">
						<a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View Claims</a>
					</td>
				</tr>
				<tr
					className="bg-white border-b hover:bg-gray-50">
					<th scope="row" className="px-6 py-4 font-medium text-gray-900">
						Jerry Mattedi
					</th>
					<td className="px-6 py-4">
						New York
					</td>
					<td className="px-6 py-4">
						United States
					</td>
					<td className="px-6 py-4">
						Self
					</td>
					<td className="px-6 py-4">
						10
					</td>
					<td className="px-6 py-4">
						$35,000
					</td>
					<td className="px-6 py-4 text-right">
						<a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View Coverage</a>
					</td>
					<td className="px-6 py-4 text-right">
						<a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View Claims</a>
					</td>
				</tr>
			</tbody>
		</table>
		</>
	);
}

const Datatable = ({ headers = [], data = [] }) => {
  return (
    <Table className="w-full" hoverable>
      <Table.Head>
        {headers.map((header) => (
          <Table.HeadCell key={header.key} className="!p-4">
            {header.name}
          </Table.HeadCell>
        ))}
      </Table.Head>
      <Table.Body className="divide-y">
        {data.map((row) => (
          <Table.Row key={row.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            {Object.values(headers).map((header, index) => (
              <Table.Cell key={`${row.id}-${index}`} className="!p-4">
                {row[header.key]}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};