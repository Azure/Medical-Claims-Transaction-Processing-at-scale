"use client";
import React, { useState, useEffect } from 'react'
import { Table, Pagination, Spinner } from 'flowbite-react';
import Link from 'next/link'
import TransactionsStatement from '../hooks/TransactionsStatement'

export default function Providers(){	
  const [page, setPage] = useState(1);
	const { data, isLoading } = TransactionsStatement.getProviders(page, 10);

	return(
		<>
			<div className="card mb-10">
				<div className="card-header">
					<h4 className="card-title">Providers</h4>
				</div>
				<div className="card-body">
					<div className="relative overflow-x-auto sm:rounded">
						{!isLoading ? (
							<ProvidersTable data={data} {...{page, setPage }} />
						) : <Spinner aria-label="Loading..." /> }
					</div>  
				</div>
			</div>
		</>
	);
}


function ProvidersTable({ data, page, setPage }){
	const headers = [
		{ key: 'name', name: 'Name'},
		{ key: 'email', name: 'Email'},
		{ key: 'country', name: 'Country'},
		{ key: 'city', name: 'City'},
		{ key: 'state', name: 'State'}
	];

	return(
		<>
			<Datatable headers={headers} {...{data}}/>
      <Pagination
        className="p-6 self-center"
        currentPage={page}
        layout="navigation"
        onPageChange={(page) => {
          setPage(page);
          //setContinuationToken(data.continuationToken);
        }}
        totalPages={100}
      />
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
                {row[header.key] ? row[header.key] : '-'}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};