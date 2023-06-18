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
		`${API_URL}/member/${memberId}`,
		fetcher
	);
};

const getCoverageByMember = (memberId) => {
	return useSWR(
		`${API_URL}/member/${memberId}`,
		fetcher
	);
};

const getClaimsByMemberId = (memberId, offset = 0, pageSize = 10) => {
	return useSWR(
		`${API_URL}/member/${memberId}/claims?offset=${offset}&limit=${pageSize}`,
		fetcher
	);
};

const getClaimDetails = (claimId) => {
	return useSWR(
		`${API_URL}/claim/${claimId}`,
		fetcher
	);
};

const TransactionsStatement={
    getMembersList,
    getMember,
    getCoverageByMember,
    getClaimsByMemberId,
    getClaimDetails
}

export default TransactionsStatement;