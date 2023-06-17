"use client";

import useSWR from "swr";
import axios from "axios";

const 
	API_URL = 'https://fa-coreclaims-ios38n2l.azurewebsites.net/api',//process.env.API_URL,
	X_FUNCTION_KEY = '-3VTIyOmv6Fj3cMi_kaVcwPHEr2nN8qM7ks4zNzdfzZ0AzFu8YepTw=='//process.env.X_FUNCTION_KEY

const fetcher = (url) => axios.get(url, { headers: { 'x-functions-key': X_FUNCTION_KEY } }).then((res) => res.data);

const getMembersList = (offset = 0, pageSize = 10) => {
	return useSWR(
		`${API_URL}/member?offset=${offset}&limit=${pageSize}`,
		fetcher
	);
};

const getMember = (memberId) => {
	return useSWR(
		`${API_URL}/member/${memberId}?`,
		fetcher
	);
};

const TransactionsStatement={
    getMembersList,
    getMember
}

export default TransactionsStatement;