const CodeToDisplayName = (c) => {
	switch(c.toString()){
		case "0": return 'Initial';
		case "1": return 'Assigned';
		case "2": return 'Acknowledged';
		case "3": return 'Approved';
		case "4": return 'Proposed';
		case "5": return 'Denied';
		case "6": return 'ApprovalRequired';
		case "8": return 'Resubmitted';
		case "9": return 'Pending';
		default: return "-";
	}
}

const ClaimStatusMap = {
	CodeToDisplayName: CodeToDisplayName
};

export default ClaimStatusMap;