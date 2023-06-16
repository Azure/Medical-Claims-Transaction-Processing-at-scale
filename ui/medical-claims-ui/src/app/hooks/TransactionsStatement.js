"use client";

import useSWR from "swr";
import axios from "axios";

//const fetcher = (url) => axios.get(url, { headers: { 'x-function-key': process.env.X_FUNCTION_KEY } }).then((res) => res.data);
const fetcher = (url) => axios.get(url, { headers: {'x-functions-key': '-3VTIyOmv6Fj3cMi_kaVcwPHEr2nN8qM7ks4zNzdfzZ0AzFu8YepTw==' }}).then((res) => res.data);

const getMembersList = (memberId, pageSize = 10) => {
	let apiUrl = process.env.API_URL;
	let xFunctionKey = process.env.X_FUNCTION_KEY;
	
	// return useSWR(
	// 	`${process.env.API_URL}/api/member/${memberId}/claims?offset=${pageSize}`,
	// 	fetcher
	// );
	return useSWR(
		`https://fa-coreclaims-ios38n2l.azurewebsites.net/api/member?offset=0&limit=${pageSize}`,
		fetcher
	);
};

const TransactionsStatement={
    getMembersList,
}

export default TransactionsStatement;