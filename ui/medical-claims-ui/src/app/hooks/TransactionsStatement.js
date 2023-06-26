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

const GetMembersList = (offset = 0, pageSize = 10) => {
	var temp =  useSWR(
		`${API_URL}/members?offset=${offset}&limit=${pageSize}`,
		fetcher
	);
	return temp;
};

const GetMember = (memberId) => {
	return useSWR(
		`${API_URL}/member/${memberId}`,
		fetcher
	);
};

const GetAdjudicator = (adjudicatorId) => {
	return useSWR(
		`${API_URL}/adjudicator/${adjudicatorId}`,
		fetcher
	);
};

const GetCoverageByMember = (memberId) => {
	return useSWR(
		`${API_URL}/member/${memberId}/coverage`,
		fetcher
	);
};

const GetClaimsByMemberId = (memberId, offset = 0, pageSize = 10) => {
	return useSWR(
		`${API_URL}/member/${memberId}/claims?offset=${offset}&limit=${pageSize}`,
		fetcher
	);
};

const GetClaimsByAdjudicatorId = (adjudicatorId, offset = 0, pageSize = 10) => {
	return useSWR(
		`${API_URL}/adjudicator/${adjudicatorId}/claims?offset=${offset}&limit=${pageSize}`,
		fetcher
	);
};

const GetClaimDetails = (claimId) => {
	return useSWR(
		`${API_URL}/claim/${claimId}`,
		fetcher
	);
};

const GetProviders = (offset = 0, pageSize = 10) => {
	return useSWR(
		`${API_URL}/payers?offset=${offset}&limit=${pageSize}`,
		fetcher
	);
};

const GetPayers = (offset = 0, pageSize = 10) => {
	return useSWR(
		`${API_URL}/providers?offset=${offset}&limit=${pageSize}`,
		fetcher
	);
};

const GetClaimHistory = (claimId) => {
	return useSWR(
		`${API_URL}/claim/${claimId}/history`,
		fetcher
	);
};

const GetClaimRecommendation = (claimId) => 
	useSWRMutation(`${API_URL}/claim/${claimId}/recommendation`,fetcher);



export const UpdateClaim = (claimId) =>
	useSWRMutation(`${API_URL}/claim/${claimId}`, put);

export const AcknowledgeClaim = (claimId) =>
	useSWRMutation(`${API_URL}/claim/${claimId}/acknowledge`, post);



const TransactionsStatement = {
    GetMembersList,
    GetMember,
    GetAdjudicator,
    GetCoverageByMember,
    GetClaimsByMemberId,
	GetClaimsByAdjudicatorId,
    GetClaimDetails,
    GetProviders,
    GetPayers,
    GetClaimHistory,
	GetClaimRecommendation,
    UpdateClaim
}

export default TransactionsStatement;