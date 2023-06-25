"use client";

import useSWR from "swr";
import useSWRMutation from 'swr/mutation'
import axios from "axios";

const 
	API_URL = process.env.NEXT_PUBLIC_API_URL,//'https://fa-coreclaims-ios38n2l.azurewebsites.net/api',
	X_FUNCTION_KEY = process.env.NEXT_PUBLIC_X_FUNCTION_KEY//'-3VTIyOmv6Fj3cMi_kaVcwPHEr2nN8qM7ks4zNzdfzZ0AzFu8YepTw=='

const fetcher = (url) => axios.get(url, { headers: { 'x-functions-key': X_FUNCTION_KEY } }).then((res) => res.data);
const put = async (url, { arg }) => await axios.put(url, arg, { headers: { 'x-functions-key': X_FUNCTION_KEY } });
const post = async (url, { arg }) => await axios.post(url, arg, { headers: { 'x-functions-key': X_FUNCTION_KEY } });

const getMembersList = (offset = 0, pageSize = 10) => {
	var temp =  useSWR(
		`${API_URL}/members?offset=${offset}&limit=${pageSize}`,
		fetcher
	);
	return temp;
};

const getMember = (memberId) => {
	return useSWR(
		`${API_URL}/member/${memberId}`,
		fetcher
	);
};

const getCoverageByMember = (memberId) => {
	return useSWR(
		`${API_URL}/member/${memberId}/coverage`,
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

const getProviders = (offset = 0, pageSize = 10) => {
	return useSWR(
		`${API_URL}/payers?offset=${offset}&limit=${pageSize}`,
		fetcher
	);
};

const getPayers = (offset = 0, pageSize = 10) => {
	return useSWR(
		`${API_URL}/providers?offset=${offset}&limit=${pageSize}`,
		fetcher
	);
};

const getClaimHistory = (claimId) => {
	return useSWR(
		`${API_URL}/claim/${claimId}/history`,
		fetcher
	);
};

const getClaimRecommendation = (claimId) => 
	useSWRMutation(`${API_URL}/claim/${claimId}/recommendation`,fetcher);


export const updateClaim = (claimId) =>
	useSWRMutation(`${API_URL}/claim/${claimId}`, put);

export const acknowledgeClaim = (claimId) =>
	useSWRMutation(`${API_URL}/claim/${claimId}/acknowledge`, post);

const TransactionsStatement = {
    getMembersList,
    getMember,
    getCoverageByMember,
    getClaimsByMemberId,
    getClaimDetails,
    getProviders,
    getPayers,
    getClaimHistory,
	getClaimRecommendation,
    updateClaim
}

export default TransactionsStatement;