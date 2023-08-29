"use client";

import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL, //'https://fa-coreclaims-ios38n2l.azurewebsites.net/api',
  X_FUNCTION_KEY = process.env.NEXT_PUBLIC_X_FUNCTION_KEY; //'-3VTIyOmv6Fj3cMi_kaVcwPHEr2nN8qM7ks4zNzdfzZ0AzFu8YepTw=='

const fetcher = (url) =>
  axios
    .get(url, { headers: { "x-functions-key": X_FUNCTION_KEY } })
    .then((res) => res.data);

const put = async (url, { arg }) =>
  await axios.put(url, arg, { headers: { "x-functions-key": X_FUNCTION_KEY } });

const post = async (url, { arg }) =>
  await axios.post(url, arg, {
    headers: { "x-functions-key": X_FUNCTION_KEY },
  });


// Function to calculate the offset
const calculateOffset = (currentPage, pageSize) => {
  return (currentPage - 1) * pageSize;
};

const buildQueryString = ({ page, pageSize = 10, sort }) => {
  const offset = calculateOffset(page, pageSize);

  const params = {};
  params.offset = offset;
  params.limit = pageSize;
  sort?.column && sort?.direction && (params.sortColumn = sort.column);
  sort?.direction && sort?.column && (params.sortDirection = sort.direction);

  return new URLSearchParams(params).toString();
}


function GetMembersList({ page = 1, sort }) {
  const queryString = buildQueryString({ page, sort });

  return useSWR(`${API_URL}/members?${queryString}`, fetcher);
};

const GetMember = (memberId) => {
  return useSWR(`${API_URL}/member/${memberId}`, fetcher);
};

const GetAdjudicator = (adjudicatorId) => {
  return useSWR(`${API_URL}/adjudicator/${adjudicatorId}`, fetcher);
};

const GetCoverageByMember = (memberId) => {
  return useSWR(`${API_URL}/member/${memberId}/coverage`, fetcher);
};

const GetClaimsByMemberId = (memberId, { page, sort }) => {
  const queryString = buildQueryString({ page, sort });  
  return useSWR(`${API_URL}/member/${memberId}/claims?${queryString}`, fetcher);
};

const GetClaimsByAdjudicatorId = (adjudicatorId, { page, sort }) => {
  const queryString = buildQueryString({ page, sort });  
  return useSWR(`${API_URL}/adjudicator/${adjudicatorId}/claims?${queryString}`, fetcher);
};

const GetClaimDetails = (claimId) => {
  return useSWR(`${API_URL}/claim/${claimId}`, fetcher);
};

const GetProviders = ({ page = 1, sort }) => {
  const queryString = buildQueryString({ page, sort });
  return useSWR(`${API_URL}/providers?${queryString}`, fetcher);
};

const GetPayers = ({ page = 1, sort }) => {
  const queryString = buildQueryString({ page, sort });
  return useSWR(`${API_URL}/payers?${queryString}`, fetcher);
};

const GetClaimHistory = (claimId) => {
  return useSWR(`${API_URL}/claim/${claimId}/history`, fetcher);
};

const GetClaimRecommendation = (claimId) =>
  useSWRMutation(`${API_URL}/claim/${claimId}/recommendation`, fetcher);

export const UpdateClaim = (claimId) =>
  useSWRMutation(`${API_URL}/claim/${claimId}`, put);

export const AcknowledgeClaim = (claimId) =>
  useSWRMutation(`${API_URL}/claim/${claimId}/acknowledge`, post);

export const GetBusinessRules = () =>
  useSWR(`${API_URL}/business-rules`, fetcher);

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
  UpdateClaim,
  GetBusinessRules
};

export default TransactionsStatement;
